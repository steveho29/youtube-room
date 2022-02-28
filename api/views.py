from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers
from .serialize import CreateRoomSerializer, RoomSerializer, UpdateRoomSerializer, UpdateVideoRoomSerializer
from .models import Room
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class CreateRoomView(APIView):
    # This is special variable. Name must be exactly "serializer_class"
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_control = serializer.data.get('guest_can_control')
            host = self.request.session.session_key
            
            querySet = Room.objects.filter(host=host)
            if querySet.exists():
                room = querySet[0]
                room.guest_can_control = guest_can_control
                room.save(update_fields=['guest_can_control', 'video_id'])
            else:
                room = Room(host=host, guest_can_control=guest_can_control)
                room.save()

            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)


class GetRoom(APIView):
    lookup_url_kward = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kward)
        if code:
            querySet = Room.objects.filter(code=code)
            if querySet.exists():
                room = querySet[0]
                data = RoomSerializer(room).data
                data['is_host'] = self.request.session.session_key == data['host']
                self.request.session['room_code'] = data['code']
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room not found': 'INVALID ROOMCODE'}, status=status.HTTP_404_NOT_FOUND)    
        return Response({'Bad request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class CheckUserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        data = {
            'roomCode': self.request.session.get('room_code'),
        }

        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if self.request.session.exists(self.request.session.session_key):
            if 'room_code' in self.request.session:
                roomCode = self.request.session.get('room_code')
                host_id = self.request.session.session_key
                self.request.session.pop('room_code')

                # If host leave => Delete Room
                queryset = Room.objects.filter(code=roomCode)
                if queryset.exists():
                    room = queryset[0]
                    if host_id == room.host:
                        room.delete()
                        return Response({'msg': f'Room {roomCode} deleted'}, status=status.HTTP_200_OK)
                return Response({'msg': f'Leave {roomCode} success'}, status=status.HTTP_200_OK)

        return Response({'msg': f'You are not in this room'}, status=status.HTTP_400_BAD_REQUEST)


class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            host_id = self.request.session.session_key
            querySet = Room.objects.filter(code=serializer.data.get('code'))
            if querySet.exists():
                room = querySet[0]

                if host_id != room.host and not room.guest_can_control:
                    return Response({'Forbidden': 'You do not own this room'}, status=status.HTTP_403_FORBIDDEN)
                
                room.video_id = serializer.data.get('video_id')

                if host_id == room.host:
                    room.guest_can_control = serializer.data.get('guest_can_control')
                    room.save(update_fields=['guest_can_control', 'video_id'])
                else:
                    room.save(update_fields=['video_id'])
                return Response({'msg': 'Update Success'}, status=status.HTTP_200_OK)
            
            return Response({'msg': 'Room not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
        

class CurrentVideo(APIView):
    def get(self, request, format=None):
        if 'room_code' not in self.request.session:
            return Response({'msg': 'You are not in any room'}, status=status.HTTP_403_FORBIDDEN)
        
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        roomCode = self.request.session.get('room_code')
        querySet = Room.objects.filter(code=roomCode)
        if not querySet.exists():
            return Response({'msg': 'Room not exists!'}, status=status.HTTP_404_NOT_FOUND)
        room = querySet[0]
        video = {
            'id': room.video_id,
            'status': room.video_status,
            'duration': room.video_duration,
            'time': room.video_current_time,
        }

        return Response(video, status=status.HTTP_200_OK)


class UpdateVideoRoom(APIView):
    serializer_class = UpdateVideoRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print(request.data)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(): 
            host_id = self.request.session.session_key
            querySet = Room.objects.filter(code=serializer.data.get('code'))
            if querySet.exists():
                room = querySet[0]

                if host_id != room.host and not room.guest_can_control:
                    return Response({'Forbidden': 'You are not allowed'}, status=status.HTTP_403_FORBIDDEN)
                    
                # room.video_id = serializer.data.get('video_id')
                if host_id == room.host:
                    room.video_status = serializer.data.get('video_status')
                    room.video_duration = serializer.data.get('video_duration')
                    room.video_current_time = serializer.data.get('video_current_time')
                    room.save(update_fields=['video_id', 'video_status', 'video_duration', 'video_current_time'])
                else:
                    room.save(update_fields=['video_id'])
                return Response({'msg': 'Update Success'}, status=status.HTTP_200_OK)
            
            return Response({'msg': 'Room not exist'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)
                