(function() {
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
  .directive('foundItems', foundItems);

  MenuSearchService.$inject = ['$http', 'ApiBasePath']
  NarrowItDownController.$inject = ['MenuSearchService'];

  function foundItems() {
    var ddo = {
      templateUrl: 'items.thtml',
      scope: {
        items: '<',
        onRemove: '&'
      }
    };

    return ddo;
  }




  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
      }).then(function (result) {

        var i = 0;
        var items = result.data.menu_items;
        var foundItems = []

        while (i < items.length)
        {
          if (items[i].description.indexOf(searchTerm) != -1) {
            foundItems.push(items[i]);
          }
          i++;
        }

        return foundItems;
      });
    };

  };


  function NarrowItDownController(MenuSearchService) {
    var menu = this;
    menu.found = [];


    menu.getMatchedMenuItems = function () {
      menu.found = []
      if (menu.searchTerm) {
        var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
        promise.then(function (response) {
          menu.found = response;
        })
        .catch(function (error) {
          console.log("GT Wrong");
        });
      }
    };

    menu.removeItem = function (i) {
      menu.found.splice(i, 1);
      if (!menu.found.length) {
        menu.error = "Nothing found";
      }
    }
  };



})();
