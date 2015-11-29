
// A new angular module for listUsers.
var app = angular.module('listUsers', ['ngRoute']);

// Create a constant to get the user json path.
app.constant('USER_JSON_PATH', 'data.json');

// Configure routes
// SPA will comes into play. Loading different content with out reloading or replacing the whole page.
// While /add and /edit a specific portion of the UI will get replaced with the new content.
app.config(['$routeProvider', function($routeProvider)
{
	$routeProvider.
			when('/show/', {
                templateUrl : 'show_user.html',
                controller  : 'userController'
            }).
			when('/remove', {
                templateUrl : 'remove_user.html',
				controller  : 'userController'
            }).
			otherwise({
                redirectTo : '/sample'
            });
    }]);

// Creating service to retrieve users list from a json file.
app.service('userService', [ '$q', '$http', function($q, $http)
{
	// Instantiate the deferred instance.
	var deferred = $q.defer();
	// http API will provide promise based response.
	this.users = function(path)
	{
		$http.get(path)
		.success(function(data) {
			deferred.resolve(data);
		})
		.error(deferred.reject);
		return deferred.promise;
	}
}])

// Create a new directive to add heading.
// Simple custom directive.
app.directive('user', function()

{
		// define a directive object.
		var directive =  {};
		directive.restrict = 'E'; /* restrict this directive to elements */
		directive.template = '<h3> List Users </h3>';
		return directive;	
});

// Custom filter to convert user name to upper-case.
app.filter('toUpperCase', function()
{
	return function(name)
	{
		return name.toUpperCase();
	}	
}
)

// Custom filter to display active users only.
app.filter('activeUsers', function()
{
	return function(users)
	{
		var filteredUsers = [];
		angular.forEach(users, function(user)
		{
			if(user.status == true)
			{
				filteredUsers.push(user);
			}			
		})	
	return filteredUsers;		
	}
})

// Create a custom directive to use add buttons common across the application.
// This directive is created with the aim that to maintain uniformity of add and edit button application level.
app.directive('addbtn', function()
{
	// define a directive object.
	var directive =  {};
	directive.restrict = 'E'; /* restrict this directive to elements */
	// transclude will be set to true so that the child elements of the element will not be replaced.
	transclude: true;
	return { 
      link: function(scope, element, attributes){
        element.addClass('btn-primary');
		element.css('width', '80px');
      }
	}
});


// Creating a userController for the module listUsers app.
app.controller('userController', [ '$scope', 'userService', 'USER_JSON_PATH', '$location', '$routeParams', function($scope, userService, USER_JSON_PATH, $location, $routeParams)
{
	//$scope.param = $routeParams.param;
	
	// User will get displayed.
	$scope.showUser = function(user)
	{
		console.log(user);
		$scope.user = user;
	}
	
	// Remove item from the list by index
	$scope.remove = function(index, name)
	{
		$scope.deletedUser = name;
		$scope.users.splice(index, 1);		
	}	
	
	userService.users(USER_JSON_PATH).then(function(data)
	{
		$scope.users = data;
		$scope.$location = $location;
	}	
	, function(error) {
    alert(error);
})
}]);

