const RoomModel=require('../models/room-model')
class RoomService{
    async create(payload){

        const {topic,roomType,ownerId}=payload;

        return await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers:[ownerId]
        })

    }
    async getAllRooms(roomTypes){
        return await RoomModel.find({roomType:{$in:roomTypes}})
        .populate('speakers').populate('ownerId').exec();
    }
}
module.exports=new RoomService()