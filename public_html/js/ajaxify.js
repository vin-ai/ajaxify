/**!
 * jQuery Tagging 1.0.0
 * @version: 1.0.0
 * @author: VINAY Kr. SHARMA http://www.vinay-sharma.com/
 * @date: 2013-04-03
 * @copyright: Copyright (c) 2013 VINAY Kr. SHARMA. All rights reserved.
 * @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
 * @website: http://www.vinay-sharma.com/
 */

+function($) {
    "use strict";

    var noop = function() {
    };
    var selector = 'a[rel="ajaxify"]';

    var Ajaxify = function(element, options) {
        this.$e = $(element)
                , this.__o = $.extend({}
                , Ajaxify.DEFAULTS,
                        $.extend({}
                        , this.$e.data() || {}
                        , options
                                ));

        if (typeof this.__o['updateto'] === 'string') {
            this.__o['updateto'] = $(this.__o['updateto']);
        }
        var href = this.$e.attr('href');

        if (this.__o['updateto'].length <= 0 || !href) {
            return;
        }

        this.__o['beforesend'] = this.__o['beforesend'] || noop;
        this.__o['done'] = this.__o['done'] || noop;
        this.__o['fail'] = this.__o['fail'] || noop;
        this.__o['always'] = this.__o['beforesend'] || noop;
    };

    Ajaxify.DEFAULTS = {
        updateto: null,
        type: 'get',
        async: false,
        // The element to set `.active` for class attribute
        activeitem: 'li',
        // The class attribute value
        activeclass: 'active'
    };

    Ajaxify.prototype.trigger = function() {
        var __opts = this.__o
                , __settings = {
                    url: this.$e.attr('href')
                };
        $.ajax(__settings)
                .done(function(d) {
                    __opts['updateto'].html(d);
                })
                .done(__opts['done'])
                .fail(__opts['fail'])
                .always(__opts['always']);
    };

    var old = $.fn.ajaxify;

    $.fn.ajaxify = function(options) {
        return this.each(function() {
            var $this = $(this)
                    , $pre = $this.data('ajaxify');
            if (!$pre) {
                $this.data('ajaxify', ($pre = new Ajaxify(this, options)))
            }
            $pre.trigger();
        });
    };

    $.fn.ajaxify.Constructor = Ajaxify;

    // AJAXIFY NO CONFLICT
    // ===============
    $.fn.ajaxify.noConflict = function() {
        $.fn.ajaxify = old;
        return this;
    };

    // AJAXIFY DATA-API
    // ============
    $(document).on('click', selector, function(e) {
        e.preventDefault();
        $(this).ajaxify();
    });

}(jQuery);