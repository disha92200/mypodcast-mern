const userService = require("../services/user-service");
const UserDtos = require("../dtos/user-dto");
class ActivateController {
  async activate(req, res) {

    const { name, avatar } = req.body;

    if (!name || !avatar) {
      res.status(400).json({ message: "All fields required" });
      return;
    }

    const userId = req.user._id;
    //console.log(req.user);
    const user = await userService.findUser({ _id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    //console.log(user);
    try {

      user.activated = true;
      user.name = name;
      user.avatar = avatar;
      user.save();

      //console.log(user);

      res.json({ user: new UserDtos(user),auth:true });

    } catch (err) {
      res.json(500).json({ message: "DB error" });
    }
  }
}

module.exports = new ActivateController();
