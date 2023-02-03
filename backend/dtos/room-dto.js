class RoomDto{
    id;
    roomType;
    topic;
    ownerId;
    speakers;
    createdAt;
    constructor(room){
        this.id=room._id;
        this.roomType=room.roomType;
        this.topic=room.topic;
        this.ownerId=room.ownerId;
        this.speakers=room.speakers;
        this.createdAt=room.createdAt;
    }
}

module.exports=RoomDto;