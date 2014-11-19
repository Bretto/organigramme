(function () {
    "use strict";

    angular.module('AppModule')
        .service('AppModelService', AppModelService);


    function AppModelService($rootScope, $state, DataContext, ngBreeze) {
        console.log('AppModel');

        var self = this;

        self.dataContext = DataContext;
        self.getEmployees = getEmployees;
        self.getTags = getTags;

        self.entityQuery = ngBreeze.EntityQuery;
        self.predicate = ngBreeze.Predicate;

        self.isSynchronized = true;

        function getEmployees(searchIds) {
            var whereClause = null;
            if (searchIds) {
                var preds = searchIds.map(function (sp) {
                    return self.predicate.create("tagMaps", "any", "tag.id", "==", sp);
                });
                whereClause = self.predicate.and(preds);
            }

            return self.dataContext.getAllEntities('Employee', whereClause);
        }

        function getTags(tag) {
            var whereClause = null;

            if (tag) {
                var pred1 = self.predicate.create('name', '==', tag.name);
                var pred2 = (tag.id) ? self.predicate.create('id', '!=', tag.id) : null;
                whereClause = self.predicate.and(pred1, pred2);
            }

            return self.dataContext.getAllEntities('Tag', whereClause);
        }


        $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {

                if ($state.params.employeeId) {
                    self.currentEmployee = DataContext.getEntityById('Employee', $state.params.employeeId)[0];
                } else {
                    self.currentEmployee = null;
                }

                if ($state.params.tagId) {
                    self.currentTag = DataContext.getEntityById('Tag', $state.params.tagId)[0];
                } else {
                    self.currentTag = null;
                }

            });

        return self;

    }

}());

