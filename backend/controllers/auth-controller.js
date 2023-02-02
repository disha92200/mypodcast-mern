const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
const refreshModel = require("../models/refresh-model");

class AuthController {
  async sendOtp(req, res) {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ message: "Phone field is required!" });
    }

    const otp = await otpService.generateOtp();

    const ttl = 1000 * 60 * 2; // 2 min
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashService.hashOtp(data);

    // send OTP
    try {
      //await otpService.sendBySms(phone, otp);
      res.json({
        hash: `${hash}.${expires}`,
        phone,
        otp,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "message sending failed" });
    }
  }

  async verifyOtp(req, res) {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
      res.status(400).json({ message: "All fields are required!" });
      return;
    }

    const [hashedOtp, expires] = hash.split(".");
    if (Date.now() > +expires) {
      res.status(400).json({ message: "OTP expired!" });
      return;
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = otpService.verifyOtp(hashedOtp, data);
    if (!isValid) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    let user;
    try {
      user = await userService.findUser({ phone });
      if (!user) {
        user = await userService.createUser({ phone });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Db error" });
      return;
    }

    const { accessToken, refreshToken } = tokenService.generateTokens({
      _id: user._id,
      activated: false,
    });

    await tokenService.storeRefreshToken(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    const userDto = new UserDto(user);
    res.json({ user: userDto, auth: true });
  }

  async refresh(req, res) {

    
    const refreshTokenFromCookie = req.cookies.refreshToken;

    let userData;

    try {
      userData = await tokenService.verifyRefreshToken(
        refreshTokenFromCookie
        );
    } catch (err) {
      console.log(err)
      return res.status(401).json({ message: "Invalid Refresh Token, not verified" });
    }

    try {

      const token = await tokenService.findRefreshToken(
        userData._id,
        refreshTokenFromCookie
        )

      if (!token) {
        return res.status(401).json({ message: "Invalid Refresh Token, not found in db" });
      }
    
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Error" });
    }

    let user;

    try {
      user = await userService.findUser({ _id: userData._id });
      if (!user) {
        return res.status(404).json({ message: "User Not Found" });
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Internal Error" });
    }

    const { refreshToken,accessToken } = tokenService.generateTokens({
      _id: userData._id,
    });

    try{

       const response= await tokenService.updateRefreshToken(
        userData._id,
        refreshToken
        )
       console.log(response)

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: 'Internal error' });
    }

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
    });
    const userDto = new UserDto(user);
    return res.json({ user: userDto, auth: true });
  }
  async logout(req,res){
    
    const {refreshToken}=req.cookies;
    try{
      await tokenService.removeRefreshToken(refreshToken);
    }catch(err){
      console.log(err)
    }

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    res.json({user:null,auth:false})
  
  }
}

module.exports = new AuthController();
