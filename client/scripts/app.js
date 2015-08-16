var myApp = angular.module('myApp', []);

myApp.controller("MainController", ['$scope', '$http', function($scope, $http){
    $scope.task = {};
    $scope.taskList = {};

    $scope.getTasks = function() {
        $http.get('/todos')
            .success(function (data) {
                $scope.taskList = data;
                console.log(data);
            })
            .error(function (error) {
                console.log('Error: ' + error);
            });
    };
    $scope.getTasks();

    $scope.deleteTask = function(tasksID) {
        $http.delete('/todos/' + tasksID)
            .success(function(data) {
                $scope.taskList = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createTask = function() {
        $http.post('/todos', $scope.task)
            .success(function(data) {
                console.log($scope.task);
                $scope.task = {};
                $scope.taskList = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
        $scope.getTasks();
    };

    $scope.completeTask = function(tasksID, tasksText, tasksComplete){
        $http.put('/todos/' + tasksID, {"text": tasksText, "complete": !tasksComplete})
            .success(function(data) {
                $scope.task = {};
                $scope.taskList = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };
}]);
