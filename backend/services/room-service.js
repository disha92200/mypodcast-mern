const RoomModel = require("../models/room-model");
class RoomService {
  async create(payload) {
    const { topic, roomType, ownerId } = payload;

    return await RoomModel.create({
      topic,
      roomType,
      ownerId,
      speakers: [ownerId],
    });
  }
  async getAllRooms(roomTypes) {
    return await RoomModel.find({ roomType: { $in: roomTypes } })
      .populate("speakers")
      .populate("ownerId")
      .exec();
  }
  async getUserRooms(ownerId) {
    return await RoomModel.find({ ownerId })
      .populate("speakers")
      .populate("ownerId")
      .exec();
  }
  async getRoomById(roomId) {
    return await RoomModel.findOne({ _id: roomId })
      .populate("speakers")
      .populate("ownerId")
      .exec();
  }
}
module.exports = new RoomService();
