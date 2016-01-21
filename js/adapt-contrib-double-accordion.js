define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var DoubleAccordion = ComponentView.extend({

        events: {
            'click .doubleaccordion-item-title': 'toggleItem',
            'click .doubleaccordion-child-item-title': 'toggleChildItem'
        },

        preRender: function() {
            // Checks to see if the accordion should be reset on revisit
            this.checkIfResetOnRevisit();
        },

        postRender: function() {
            this.setReadyStatus();
        },

        // Used to check if the accordion should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }

            _.each(this.model.get('_items'), function(item) {
                _.filter(item._child, function(child) {         
                    child._isVisited = false;
                });
            });
        },

        toggleItem: function(event) {
            event.preventDefault();
            this.$('.doubleaccordion-item-body').stop(true, true).slideUp(400);

            if (!$(event.currentTarget).hasClass('selected')) {
                this.$('.doubleaccordion-item-title').removeClass('selected');
                var body = $(event.currentTarget).addClass('selected visited').siblings('.doubleaccordion-item-body').slideToggle(200, function() {
                  $(body).a11y_focus();
                });
                this.$('.doubleaccordion-item-title-icon').removeClass('icon-minus').addClass('icon-plus');
                $('.doubleaccordion-item-title-icon', event.currentTarget).removeClass('icon-plus').addClass('icon-minus');

            } else {
                this.$('.doubleaccordion-item-title').removeClass('selected');
                $(event.currentTarget).removeClass('selected');
                $('.doubleaccordion-item-title-icon', event.currentTarget).removeClass('icon-minus').addClass('icon-plus');
            }
            // set aria-expanded value
            if ($(event.currentTarget).hasClass('selected')) {
                $('.doubleaccordion-item-title').attr('aria-expanded', false);
                $(event.currentTarget).attr('aria-expanded', true);
            } else {
                $(event.currentTarget).attr('aria-expanded', false);
            }
        },

         toggleChildItem: function(event) {
            event.preventDefault();
            this.$('.doubleaccordion-child-item-body').stop(true, true).slideUp(200); 
             
            if (!$(event.currentTarget).hasClass('selected')) { 
                this.$('.doubleaccordion-child-item-title').removeClass('selected');  
                var body = $(event.currentTarget).addClass('selected visited').siblings('.doubleaccordion-child-item-body').slideToggle(200, function() {
                    $(body).a11y_focus();
                });
                this.$('.doubleaccordion-child-item-title-icon').removeClass('icon-minus').addClass('icon-plus');
                $('.doubleaccordion-child-item-title-icon', event.currentTarget).removeClass('icon-plus').addClass('icon-minus');

                if ($(event.currentTarget).hasClass('doubleaccordion-child-item')) {
                    this.setVisitedChild($(event.currentTarget).index());
                } else {
                    this.setVisitedChild($(event.currentTarget).parentsUntil('.doubleaccordion-item').parent().index(), $(event.currentTarget).parent('.doubleaccordion-child-item').index());
                }
            } else {
                this.$('.doubleaccordion-child-item-title').removeClass('selected');
                $(event.currentTarget).removeClass('selected');
                $('.doubleaccordion-child-item-title-icon', event.currentTarget).removeClass('icon-minus').addClass('icon-plus');
            }
            // set aria-expanded value
            if ($(event.currentTarget).hasClass('selected')) {
                $('.doubleaccordion-item-title').attr('aria-expanded', false);
                $(event.currentTarget).attr('aria-expanded', true);
            } else {
                $(event.currentTarget).attr('aria-expanded', false);
            }            
        },

        setVisitedChild: function(parent, index) {
            var item = this.model.get('_items')[parent]._child[index];
            item._isVisited = true;
            console.log(item);
            this.checkCompletionStatus();
        },        

        getVisitedItems: function() {
            var numItems = 0;
                _.filter(this.model.get('_items'), function(item) {
                    _.filter(item._child, function(child) {
                        numItems++;
                    });
                });
            return numItems;
        },

        checkCompletionStatus: function() {
            var numChild = 0;
            _.filter(this.model.get('_items'), function(item) {
                _.filter(item._child, function(child) {
                    if(child._isVisited == true){                       
                        numChild++;
                    }
                });
            });     

            if (this.getVisitedItems() == numChild) {
                this.setCompletionStatus();
            }
        }
    });

    Adapt.register('doubleaccordion', DoubleAccordion);

    return DoubleAccordion;

});
