(function (mw, $) {

    /**
     * ChameleonFannon Namespace
     *
     * @type {Object}
     */
    mw.libs.ChameleonFannon = {};

    /**
     * Looks for a semantic property and makes it to a global tag, displayed besides the page title
     * Warning: This only works with annotated templates (If using mobo, use annotated-table or annotated-ul)
     * @param  {[type]} propertyName [description]
     * @param  {[type]} title        [description]
     * @return {[type]}              [description]
     */
    mw.libs.ChameleonFannon.createGlobalTag = function(propertyName, title) {

        try {
            var el = $('[data-property=' + propertyName + ']');
            if (el && el.length > 0 && el.text() === 'Ja') {
                url = mw.config.get('wgScript') + '/Spezial:Suche_mittels_Attribut/' + propertyName + '/wahr';
                $('#firstHeading').append('<a class="mobo-tag mobo-tag-' + propertyName + '" href="' + url + '">' + title + '</div>');
            }
        } catch (e) {
            console.log('mw.libs.ChameleonFannon.createGlobalTag() crashed');
            console.error(e);
        }
    }

    /**
     * Removes rows from tables and creates tags from the values instead that will be appended / prepended to other cells
     *
     * @param  {string}         tableClass   CSS Class of table to process
     * @param  {string}         propertyName PropertyName (Uppercase! See HTML)
     * @param  {string|boolean} name         Human readable name
     * @param  {string|boolean} cssClass     Add following CSS classes to the tag
     * @param  {string|boolean} condition    If and condition (string) is given,
     * @param  {number}         index        Index of the column to insert the tags in (starts with 0)
     * @param  {boolean}        prepend      If true the tag will be prepended, if false appended (default)
     */
    mw.libs.ChameleonFannon.createTableTag = function(tableClass, propertyName, name, cssClass, condition, index, prepend) {

        try {
            var tableClass = tableClass || 'smwtable';
            var index = index || 0;
            var cssClass = cssClass || 'label label-default'
            var name = name || propertyName;

            $('.' + tableClass + ' th.' + propertyName).hide();
            $('.' + tableClass + ' td.' + propertyName).each(function(i, el) {
                var $el = $(el);

                $el.hide();

                var tag = $('<span> </span><span class="' + cssClass + '">' + name + '</span><span> </span>');

                if (!condition) {
                    name = el.textContent;
                }

                if (condition && (el.textContent !== condition)) {
                    return;
                } else {
                    if (prepend) {
                        $($el.parent()[0].childNodes[index]).prepend(tag);
                    } else {
                        $($el.parent()[0].childNodes[index]).append(tag);
                    }
                }

            });
        } catch (e) {
            console.log('mw.libs.ChameleonFannon.createTableTag() crashed');
            console.error(e);
        }
    }

    /**
     * Hides empty HeaderTabs
     * TODO: Doesn't hide if hidden properties are inserted
     */
    mw.libs.ChameleonFannon.hideEmptyTabs = function() {

        try {
            var $headertabs = $('.action-view #headertabs')
            if ($headertabs.length > 0 && !$(document.body).hasClass('mw-special-FormEdit')) {
                var style = '<style>';

                $headertabs.children().each(function(i, el) {

                    var $el = $(el);

                    if (el.id) {

                        // Hide all Tabs that don't contain data from forms or ask queries
                        if ($el.find('[data-property]').length === 0) {
                            if (el.id !== '_C3_9Cbersicht') { // Never hide the "Übersicht" tab
                                console.log('mw.libs.ChameleonFannon.hideEmptyTabs() :: ' + el.id);
                                style += 'li[aria-controls=' + el.id + '] {display: none;} ';
                            }
                        }
                    }

                });
                style += '</style>';
                $('html > head').append($(style));
            }

        } catch (e) {
            console.log('mw.libs.ChameleonFannon.hideEmptyTabs() crashed');
            console.error(e);
        }

    }

    /**
     * Hides empty HeaderTabs
     * TODO: Doesn't hide if hidden properties are inserted
     */
    mw.libs.ChameleonFannon.accordeonize = function(h3title) {

        try {

            var entryPoints = $("h2:contains('" + h3title + "')");

            var id = 0;

            for (var i = 0; i < entryPoints.length; i++) {

                var h2 = entryPoints[i];

                var html = '<div class="panel-group accordion" id="accordion-' + id + '" role="tablist" aria-multiselectable="true">';
                html    += '    <div class="panel panel-default">';
                html    += '        <div class="panel-heading" role="tab" id="acc-header-' + id + '">';
                html    += '            <h4 class="panel-title">';
                html    += '                <a data-toggle="collapse" data-parent="#accordion-' + id + '" href="#collapse-' + id + '" aria-expanded="true" aria-controls="collapse-' + id + '">';
                html    += '                    <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span> Alle Einträge';
                html    += '                </a>';
                html    += '            </h4>';
                html    += '        </div>';
                html    += '    </div>';
                html    += '    <div id="collapse-' + id + '" class="panel-collapse collapse collapse-generated" role="tabpanel" aria-labelledby="acc-header-' + id + '">';
                html    += '        <div class="panel-body"></div>';
                html    += '    </div>';
                html    += '</div>';

                var accordion = $(html);
                $(h2).before(accordion);

                var currentEl = entryPoints[i].nextSibling;
                var accordionBody = accordion.find('.panel-body').first();

                $(h2).detach(); // Remove the H2

                // Iterate all siblings until there is no more or it is an H2, too
                while (currentEl) {

                    if (currentEl.tagName && currentEl.tagName === 'H2') {
                        currentEl = false; // Break
                    } else {
                        var nextSibling = currentEl.nextSibling;
                        $(currentEl).detach().appendTo(accordionBody);
                        currentEl = nextSibling;
                    }

                }

                id += 1; // Iterate Accordion ID

            }

        } catch (e) {
            console.log('mw.libs.ChameleonFannon.accordeonize() crashed');
            console.error(e);
        }

    }



    $(document).ready(function() {

        try {

            //////////////////////////////////////////
            // ChameleonTopMenu Buttons             //
            //////////////////////////////////////////

            // Add View button to main hierachy of chameleon menu
            if ($('#ca-nstab-main').length > 0 && !($('body').hasClass('action-view'))) {
                $($('.navbar-collapse > .navbar-nav')[1]).append($('#ca-nstab-main').clone());
            }
            // Add SF FormEdit button to main hierachy of chameleon menu
            if ($('#ca-form_edit').length > 0 && !($('body').hasClass('action-formedit'))) {
                $($('.navbar-collapse > .navbar-nav')[1]).append($('#ca-form_edit').clone());
            }
            // Add second Save Button in main menu
            if ($("#wpSave").length > 0) {
                var save = $('<li id="sf-save-alt" ><a href="#" title="Änderungen speichern [alt-shift-s]" accesskey="s">Speichern</a></li>')
                $($('.navbar-collapse > .navbar-nav')[1]).append(save);
                save.on('click', function() {
                    $("#wpSave").click();
                });
            }


            //////////////////////////////////////////
            // Global Tags                          //
            //////////////////////////////////////////

            // Tag Quality informations
            if ($('.formdata-Qualitaet').length > 0) {
                mw.libs.ChameleonFannon.createGlobalTag('inBearbeitung', 'In Bearbeitung');
                mw.libs.ChameleonFannon.createGlobalTag('falsch', 'Vermutlich falsch');
                mw.libs.ChameleonFannon.createGlobalTag('ungenuegend', 'Ungenügend');
                mw.libs.ChameleonFannon.createGlobalTag('veraltet', 'Veraltet');

                // TODO: Refactor this into an own function
                // Free tags (semicolon separated list)
                var tags = $('[data-property=tag]');
                if (tags.length > 0) {
                    var val = tags.text();

                    if (val.trim()) {
                        $.each(val.split(';'), function(index, value) {
                            value = value.trim();
                            url = mw.config.get('wgScript') + '/Spezial:Suche_mittels_Attribut/Tag/' + value;
                            $('#firstHeading').append('<a class="mobo-tag mobo-tag-tag" href="' + url + '">' + value + '</a>');
                        });
                    }
                }
            }


            //////////////////////////////////////////
            // Tag Table Columns                    //
            //////////////////////////////////////////

            // tableClass, propertyName, name, cssClass, condition, index, prepend
            mw.libs.ChameleonFannon.createTableTag('KontaktDatenAsk', 'Bevorzugt', 'bevorzugt', 'label label-warning', 'wahr', 5, true);
            mw.libs.ChameleonFannon.createTableTag('KontaktDatenAsk', 'Privat', 'privat', 'label label-danger', 'wahr', 5, true);
            mw.libs.ChameleonFannon.createTableTag('AdressenAsk', 'Privat', 'privat', 'label label-danger', 'wahr', 0, false);
            // mw.libs.ChameleonFannon.createTableTag('HatMitarbeiterAsk', 'Rolle', false, false, false, 0, false);


            //////////////////////////////////////////
            // Adjustments                          //
            //////////////////////////////////////////

            // Hide empty tabs
            mw.libs.ChameleonFannon.hideEmptyTabs();

            // Checklist Hack: If the body contains the word "Checkliste", increase the min-width of the labels
            // TODO: Refactor this? Requires "Checkliste" to be part of the Title
            if (document.body.className.indexOf("Checkliste") > -1) {
                console.log('CHECKLIST!');
                $('#sfForm').addClass('checklistForm');

                $('.formdata td').each(function() {
                    $(this).addClass($(this).text().trim());
                });
            }

            // Color booleans
            // $('.smwtable td:contains("falsch")').addClass('td-false');
            // $('.smwtable td:contains("wahr")').addClass('td-true');

            $('.formdata [data-property]:contains("Nein")').html('<span class="glyphicon glyphicon-remove" style="color: #A94442" aria-hidden="true"></span>');
            $('.formdata [data-property]:contains("Ja")').html('<span class="glyphicon glyphicon-ok" style="color: #7CCF2C" aria-hidden="true"></span>');


            //////////////////////////////////////////
            // Alle Einträge                        //
            //////////////////////////////////////////

            mw.libs.ChameleonFannon.accordeonize('Alle Einträge');


            //////////////////////////////////////////
            // Fixes                                //
            //////////////////////////////////////////

            // QUICK-FIX: The parent container of a select2 widget is a block div by default.
            // This moves potential info icons down to the next row.
            // To avoid this, make the element an inline-block.
            // Since CSS doesn't support selecting a parent, this has to be done through JavaScript.
            $('sf-select2-container').parent().css({
                'display': 'inline-block'
            });

            // Auto trims all Input fields
            // TODO: Seems unnecessary
            // mw.hook('sf.formValidationBefore').add(function() {
            //     console.log('sf.formValidationBefore');
            //     var $inputFields = $('#sfForm input');

            //     $inputFields.each(function() {
            //         var val = $(this).val();
            //         var trim = val.trim();
            //         if (val !== trim) {
            //             $(this).val(trim);
            //             console.log('Trimmed "' + val + '" to "' + trim + '"');
            //         }
            //     });
            // });


        } catch (e) {
            console.error('ChameleonFannon.js crashed');
            console.error(e);
        }

    });


}(mediaWiki, jQuery));