/**!
 * jQuery Ajaxify
 * @version: 1.0.1
 * @author: VINAY Kr. SHARMA http://www.vinay-sharma.com/
 * @date: 2013-12-08
 * @copyright: Copyright (c) 2015 VINAY Kr. SHARMA. All rights reserved.
 * @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
 * @website: http://www.vinay-sharma.com/
 * @param {object} $ jQuery instance
 */

(function ($) {
    "use strict";

    /**
     * An Empty function, which actually nothing does ;)
     * @function {jQuery.noop}
     */
    var noop = $.noop;

    /**
     * Elements selector to apply Ajaxify on
     * Default: a[data-rel="ajaxify"]
     * to select all anchor elements having attribute `data-rel` with value ajaxify.
     * Configure Ajaxify with your own
     * @string {string}
     */
    var selector = 'a[data-rel="ajaxify"]';

    /**
     * An object which initializes for each matched elements
     * @param jQuery Selected DOM Element
     * @param options Configuration
     * @constructor
     */
    var Ajaxify = function (element, options) {
        var $element = $(element);
        this.$e = $element
            , options = $.extend({}
            , Ajaxify.DEFAULTS,
            $.extend({}
                , $element.data() || {}
                , options
            ));

        if(options['load_to'] === null) {
            options['load_to'] = noop;
        } else if(typeof options['load_to'] !== 'function') {
            options['load_to'] = function(data) {
                $(options['load_to']).html(data);
            }
        }

        if (options['href'] === null && $element.attr('href') !== undefined) {
            options['href'] = $element.attr('href');
        }

        options['before_send'] = options['before_send'] || noop;
        options['done'] = options['done'] || noop;
        options['fail'] = options['fail'] || noop;
        options['always'] = options['always'] || noop;

        // If nav container if null then select the parent of the
        // `activate` element. That's could be one of `ul` or `ol`
        // if `options['activate']` is "li".
        if(options['container'] === null) {
            options['container'] = $(options['activate']).parent();
        }
        // or if `container` if a type of string then find by jQuery
        // and assign
        else if(typeof options['container'] !== 'function') {
            options['container'] = $(options['container']);
        }

        // if `activate` if not a function then assign with a new function
        // which will take role of activate element by adding `activate_class` value
        // and de-activate old element by removing `activate_class` value
        if(typeof options['activate'] !== 'function') {
            options['activate'] = function() {
                // First find `activate` element in nav `container`
                // and remove css class
                options['container'].find("." + options['active_class'])
                    .removeClass(options['active_class']);
                // Then `activate` the element by setting `active_class`
                $(options['activate']).addClass(options['active_class']);
            }
        }
        if(typeof options['data'] === 'function') {
            options['data'] = options['data']();
        } else if(options['data'] === null) {
            options['data'] = {};
        }
        // Bypass options to prototype
        this.options = options;
    };

    Ajaxify.DEFAULTS = {
        //
        load_to: null
        // Request method
        , method: 'get'
        // Type of the response will get from requested URL
        , type: 'html'
        // Data to be submit on requesting URL
        , data: null
        // Request has to be made on
        , href: null
        // Read jQuery $.ajax info for more about `async`
        , async: false
        // The element which contains all the .ajaxify elements
        // This helps to activate and deactivate active class element
        // after Ajax load
        , container: null
        // The element to highlight by adding CSS class, or pass
        // a function set by your own
        , activate: 'li'
        // The class attribute value
        // Will be used if `activate` has initialized by a string
        // Else not going to use it
        , active_class: 'active'
        // Load element before it's become visible in screen
        // Default: 100px
        // @TODO: Implement Later
        , threshold: 100
        // Extra Request headers, or setup in $.ajax_setup
        // @TODO: Implement Later
        , request_headers: {}
        // Just like a CRON, Ajaxify will request URL again and again
        // @TODO: Implement Later
        , request_interval: 0
    };

    Ajaxify.prototype.trigger = function () {
        var options = this.options
            , $element = this.$e
            , request_url = options['href']
            , request_options = {
                data: options['data']
                , type: options['method']
                , dataType: options['type']
            };
        
        options['before_send']();
        $.ajax(request_url, request_options)
            .done(function (d) {
                options['load_to'](d);
                options['done'](d);
                if (options['container'] && options['activate']) {
                    if (options['container'].length > 0) {
                        options['activate']();
                    }
                }
            })
            .fail(options['fail'])
            .always(options['always']);
    };

    var old = $.fn.ajaxify;

    $.fn.ajaxify = function (options) {
        return this.each(function () {
            var $this = $(this) // Current element in selection
                , $pre = $this.data('ajaxify'); // Find an assignment of Ajaxify
            // Create the Ajaxify object in element's DOM
            // for later use if not found
            if (!$pre) {
                $this.data('ajaxify', ($pre = new Ajaxify(this, options)))
            }
            // Now finally trigger the purpose ;)
            $pre.trigger();
        });
    };

    $.fn.ajaxify.Constructor = Ajaxify;

    // AJAXIFY NO CONFLICT
    // ===============
    $.fn.ajaxify.noConflict = function () {
        $.fn.ajaxify = old;
        return this;
    };

    // AJAXIFY DATA-API
    // ============
    $(document).on('click', selector, function (e) {
        e.preventDefault();
        $(this).ajaxify();
    });

})(jQuery || django.jQuery);
