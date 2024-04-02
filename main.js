angular.module('usersApp', [])
    .controller('HomeController', function ($scope, $http) {
        $http.get("heliverse_mock_data.json")
            .then(function (response) {
                $scope.Users = response.data.records;
                initializePagination();
            });

        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.totalPages = 0;
        $scope.pagedUsers = [];
        $scope.team = [];

        $scope.searchText = {
            first_name: '',
            last_name: ''
        };
        // Filter options
        $scope.filters = {
            gender: {
                male: false,
                female: false
            },
            domain: '',
            availability: ''
        };

        function initializePagination() {
            // Calculate total pages
            $scope.totalPages = Math.ceil($scope.Users.length / $scope.pageSize);
            loadPage();
        }

        function loadPage() {
            var startIndex = ($scope.currentPage - 1) * $scope.pageSize;
            var endIndex = Math.min(startIndex + $scope.pageSize, $scope.Users.length);
            $scope.pagedUsers = $scope.Users.slice(startIndex, endIndex);
        }

        $scope.prevPage = function () {
            if ($scope.currentPage > 1) {
                $scope.currentPage--;
                loadPage();
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.totalPages) {
                $scope.currentPage++;
                loadPage();
            }
        };

        $scope.searchText = function (user) {
            var Name = !$scope.searchText.first_name && !$scope.searchText.last_name || user.first_name.toLowerCase().includes($scope.searchText.first_name.toLowerCase());
            return Name;
        };

        $scope.filterRecords = function (user) {
            var GenderFilter = !$scope.filters.gender.male && !$scope.filters.gender.female ||
                $scope.filters.gender.male && user.gender.toLowerCase() === 'male' ||
                $scope.filters.gender.female && user.gender.toLowerCase() === 'female';

            var DomainFilter = !$scope.filters.domain || user.domain.toLowerCase().includes($scope.filters.domain.toLowerCase());

            var AvailabilityFilter = !$scope.filters.availability || user.available.toString() === $scope.filters.availability;
            return GenderFilter && DomainFilter && AvailabilityFilter;
        };

        $scope.createTeam = function () {
            var uniqueUsers = $scope.pagedUsers.filter(function (user) {
                return user.selected && isUnique(user, $scope.team);
            });

            if ($scope.pagedUsers.filter(function(user) { return user.selected; }).length === 0) {
                alert("Please choose at least one user from the list.");
                return;
            }
            else if (uniqueUsers.length !== $scope.pagedUsers.filter(function (user) { return user.selected; }).length) {
                alert("Please choose unique users based on domain and availability.");
                return;
            }

            $scope.team = $scope.team.concat(uniqueUsers);
        };
        function isUnique(user, team) {
            for (var i = 0; i < team.length; i++) {
                if (team[i].domain === user.domain && team[i].available === user.available) {
                    return false; 
                }
            }
            return true;
        }

    });
