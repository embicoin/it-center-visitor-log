/*jshint strict: false */
angular.module('iTCenterVisitorLog.controllers', ['ngRoute'])

.config(function($routeProvider) {
	$routeProvider
		.otherwise({
			redirectTo:'/main'
		});
})

.controller('MainCtrl', ['$scope', '$http', '$location', 'googleAuthService', 'googlePlusService', 'googleCalendarService', function($scope, $http, $location, googleAuthService, googlePlusService, googleCalendarService) {
	$scope.authenticated = false;
	$scope.userInfo = {};
	$scope.userInfoResolved = false;
	$scope.calendarEvents = {};
	$scope.calendarEventsResolved = false;
	
	$scope.init = function() {
		googleAuthService.init();
		googleAuthService.isAuthenticated().then(function(authenticated) {
			$scope.authenticated = authenticated;
			if(!authenticated) {
				return;
			}
			
			googlePlusService.getUserInfo().then(function(userInfo) {
				$scope.userInfo = userInfo;
				$scope.userInfoResolved = true;
			});
			
			googleCalendarService.getTodaysEvents().then(function(calendarEvents) {
				/*TODO remove this*/
				for (var i = 0; i < calendarEvents.items.length; i++) {
					calendarEvents.items[i].badges = [1,2];
				}
				$scope.calendarEvents = calendarEvents;
				$scope.calendarEventsResolved = true;
			});
		});
	};
	
	$scope.showPage = function (page) {
		$location.path('/' + page);
	};
	
	$scope.authenticate = function () {
		if($scope.authenticated) {
			return;
		}
		googleAuthService.authenticate().then(function(authenticated) {
			$scope.authenticated = authenticated;
		});
	};
}]);