/**!
 * jQuery Ajaxify 1.0.0
 * @version: 1.0.0
 * @author: VINAY Kr. SHARMA http://www.vinay-sharma.com/
 * @date: 2013-12-08
 * @copyright: Copyright (c) 2013 VINAY Kr. SHARMA. All rights reserved.
 * @license: Licensed under Apache License v2.0. See http://www.apache.org/licenses/LICENSE-2.0
 * @website: http://www.vinay-sharma.com/
 * @param {object} $ jQuery instance
 */

+function($) {
    "use strict";

    var noop = function() {
    };
    var selector = 'a[rel="ajaxify"]';

    var Ajaxify = function(element, options) {
        var __t = $(element);
        this.$e = __t
                , this.__o = $.extend({}
                , Ajaxify.DEFAULTS,
                        $.extend({}
                        , __t.data() || {}
                        , options
                                ));

        if (typeof this.__o['loadto'] === 'string' && this.__o['loadto'] !== '') {
            this.__o['loadto'] = $(this.__o['loadto']);
        }
        
        if (this.__o['href'] === null && __t.attr('href') !== undefined) {
            this.__o['href'] = __t.attr('href');
        }

        if (this.__o['loadto'].length <= 0 || !this.__o['href']) {
            return;
        }

        this.__o['beforesend'] = this.__o['beforesend'] || noop;
        this.__o['done'] = this.__o['done'] || noop;
        this.__o['fail'] = this.__o['fail'] || noop;
        this.__o['always'] = this.__o['always'] || noop;
    };

    Ajaxify.DEFAULTS = {
        loadto: null
        , method: 'get'
        , type: 'html'
        , data: null
        , href: null
        , async: false
                // The element which contains all the .ajaxify elements
                // This helps to activate and deactivate active class element
                // after Ajax load
        , container: 'ul'
                // The element to set `.active` for class attribute
        , activate: 'li'
                // The class attribute value
        , activeclass: 'active'
    };

    Ajaxify.prototype.trigger = function() {
        var __o = this.__o
                , __t = this.$e
                , __u = __o['href']
                , __s = {
                    data: typeof __o['data'] === 'function' ? __o['data'](__t) : {}
                    , type: __o['method']
                    , dataType: __o['type']
                };
        $.ajax(__u, __s)
                .done(function(d) {
                    __o['loadto'].html(d);
                    __o['done']();
                    if (__o['container'] !== '' && __o['activate'] !== '' && __o['activeclass'] !== '') {
                        var __container = __t.closest(__o['container']);
                        if (__container.length > 0) {
                            __container.find(__o['activate']).removeClass(__o['activeclass']);
                            __t.parent(__o['activate']).addClass(__o['activeclass']);
                        }
                    }
                })
                .fail(__o['fail'])
                .always(__o['always']);
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
