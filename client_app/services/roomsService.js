/**
 * Created by reuvenp on 4/13/2017.
 */
angular.module('myApp').factory('roomsService', ['$http', '$q', '$rootScope', roomsService]);
function roomsService($http, $q, $rootScope) {
    var services = {};
    services.my_rooms = [];
    services.my_admin_rooms = [];
    services.my_pending_rooms = [];
    services.other_rooms = [];

    var getMyRooms = function () {
        services.my_rooms.length = 0;
        var deferred = $q.defer();
        $http.get('/rooms/getRoomsOfUser').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.my_rooms[i] = res.data[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var getMyPendingRooms = function () {
        services.my_pending_rooms.length = 0;
        var deferred = $q.defer();
        $http.get('/rooms/getPendingRoomsOfUser').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.my_pending_rooms[i] = res.data[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var getMyOtherRooms = function () {
        services.other_rooms.length = 0;
        var deferred = $q.defer();
        $http.get('/rooms/getAvailableRoomsOfUser').then(
            function (res) {
                for (var i = 0; i < res.data.length; i++) {
                    services.other_rooms[i] = res.data[i];
                }
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var refreshRoomsLists = function () {
        getMyOtherRooms();
        getMyPendingRooms();
        getMyRooms();
    };

    var join_room = function (roomId) {
        var deferred = $q.defer();
        $http.post('/rooms/join_room/' + roomId).then(
            function (res) {
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    var addRoom = function (roomName) {
        var deferred = $q.defer();
        $http.post('/rooms/add_room/' + roomName).then(
            function (res) {
                deferred.resolve();
            }, function (res) {
                deferred.reject(res);
            }
        );

        return deferred.promise;
    };

    services.getMyPendingRooms = getMyPendingRooms;
    services.getMyRooms = getMyRooms;
    services.getMyOtherRooms = getMyOtherRooms;
    services.refreshRoomsLists = refreshRoomsLists;
    services.join_room = join_room;
    services.addRoom = addRoom;
    return services;
}