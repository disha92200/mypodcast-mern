const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");
class RoomsController {
  async create(req, res) {
    const { roomType, topic } = req.body;
    if (!roomType || !topic) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }

    const ownerId = req.user._id;

    let room;
    try {
      room = await roomService.create({ roomType, topic, ownerId });
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }

    return res.json(new RoomDto(room));
  }
  async index(req, res) {
    const rooms = await roomService.getAllRooms(["open"]);
    const allRooms = rooms.map((room) => {
      return new RoomDto(room);
    });
    //console.log(allRooms)
    return res.json(allRooms);
  }
  async show(req, res) {
    const { roomId } = req.params;
    try {
      const room = await roomService.getRoomById(roomId);
      return res.json(room);
    } catch (err) {
      return res.status(500).json({ message: "Internal Error" });
    }
  }
}

module.exports = new RoomsController();
