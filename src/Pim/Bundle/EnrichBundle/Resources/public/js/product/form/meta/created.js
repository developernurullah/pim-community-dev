 'use strict';

define(
    [
        'underscore',
        'pim/form',
        'text!pim/template/product/meta/created'
    ],
    function (_, BaseForm, formTemplate) {
        var FormView = BaseForm.extend({
            tagName: 'span',
            template: _.template(formTemplate),
            render: function () {
                this.$el.html(
                    this.template({
                        product: this.getData()
                    })
                );

                return this;
            }
        });

        return FormView;
    }
);
