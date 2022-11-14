/*! For license information please see all.js.LICENSE.txt */
(() => {
  var t = {
      465: function (t, e) {
        var o, n;
        void 0 ===
          (n =
            'function' ==
            typeof (o = function () {
              var t = {
                removeAttributeValue: function (t, e, o) {
                  var n, i;
                  t.getAttribute(e) &&
                    (t.getAttribute(e) == o
                      ? t.removeAttribute(e)
                      : ((n = new RegExp('(^|\\s)' + o + '(\\s|$)')),
                        (i = t.getAttribute(e).match(n)) &&
                          3 == i.length &&
                          t.setAttribute(e, t.getAttribute(e).replace(n, i[1] && i[2] ? ' ' : ''))));
                },
                addAttributeValue: function (t, e, o) {
                  t.getAttribute(e)
                    ? new RegExp('(^|\\s)' + o + '(\\s|$)').test(t.getAttribute(e)) ||
                      t.setAttribute(e, t.getAttribute(e) + ' ' + o)
                    : t.setAttribute(e, o);
                },
                dragAndDropSupported: function () {
                  return void 0 !== document.createElement('div').ondrop;
                },
                formDataSupported: function () {
                  return 'function' == typeof FormData;
                },
                fileApiSupported: function () {
                  var t = document.createElement('input');
                  return (t.type = 'file'), void 0 !== t.files;
                },
                nodeListForEach: function (t, e) {
                  if (window.NodeList.prototype.forEach) return t.forEach(e);
                  for (var o = 0; o < t.length; o++) e.call(window, t[o], o, t);
                },
                initAll: function (e) {
                  var o = void 0 !== (e = void 0 !== e ? e : {}).scope ? e.scope : document,
                    n = o.querySelectorAll('[data-module="moj-add-another"]');
                  t.nodeListForEach(n, function (e) {
                    new t.AddAnother(e);
                  });
                  var i = o.querySelectorAll('[data-module="moj-multi-select"]');
                  t.nodeListForEach(i, function (e) {
                    new t.MultiSelect({
                      container: e.querySelector(e.getAttribute('data-multi-select-checkbox')),
                      checkboxes: e.querySelectorAll('tbody .govuk-checkboxes__input'),
                    });
                  });
                  var r = o.querySelectorAll('[data-module="moj-password-reveal"]');
                  t.nodeListForEach(r, function (e) {
                    new t.PasswordReveal(e);
                  });
                  var a = o.querySelectorAll('[data-module="moj-rich-text-editor"]');
                  t.nodeListForEach(a, function (e) {
                    var o = { textarea: $(e) },
                      n = e.getAttribute('data-moj-rich-text-editor-toolbar');
                    if (n) {
                      var i = n.split(',');
                      for (var r in ((o.toolbar = {}), i)) o.toolbar[i[r]] = !0;
                    }
                    new t.RichTextEditor(o);
                  });
                  var s = o.querySelectorAll('[data-module="moj-search-toggle"]');
                  t.nodeListForEach(s, function (e) {
                    new t.SearchToggle({
                      toggleButton: {
                        container: $(e.querySelector('.moj-search-toggle__toggle')),
                        text: e.getAttribute('data-moj-search-toggle-text'),
                      },
                      search: { container: $(e.querySelector('.moj-search')) },
                    });
                  });
                  var l = o.querySelectorAll('[data-module="moj-sortable-table"]');
                  t.nodeListForEach(l, function (e) {
                    new t.SortableTable({ table: e });
                  }),
                    (l = o.querySelectorAll('[data-module="moj-sortable-table"]')),
                    t.nodeListForEach(l, function (e) {
                      new t.SortableTable({ table: e });
                    });
                },
                AddAnother: function (t) {
                  (this.container = $(t)),
                    this.container.data('moj-add-another-initialised') ||
                      (this.container.data('moj-add-another-initialised', !0),
                      this.container.on(
                        'click',
                        '.moj-add-another__remove-button',
                        $.proxy(this, 'onRemoveButtonClick')
                      ),
                      this.container.on('click', '.moj-add-another__add-button', $.proxy(this, 'onAddButtonClick')),
                      this.container
                        .find('.moj-add-another__add-button, moj-add-another__remove-button')
                        .prop('type', 'button'));
                },
              };
              return (
                (t.AddAnother.prototype.onAddButtonClick = function (t) {
                  var e = this.getNewItem();
                  this.updateAttributes(this.getItems().length, e), this.resetItem(e);
                  var o = this.getItems().first();
                  this.hasRemoveButton(o) || this.createRemoveButton(o),
                    this.getItems().last().after(e),
                    e.find('input, textarea, select').first().focus();
                }),
                (t.AddAnother.prototype.hasRemoveButton = function (t) {
                  return t.find('.moj-add-another__remove-button').length;
                }),
                (t.AddAnother.prototype.getItems = function () {
                  return this.container.find('.moj-add-another__item');
                }),
                (t.AddAnother.prototype.getNewItem = function () {
                  var t = this.getItems().first().clone();
                  return this.hasRemoveButton(t) || this.createRemoveButton(t), t;
                }),
                (t.AddAnother.prototype.updateAttributes = function (t, e) {
                  e.find('[data-name]').each(function (o, n) {
                    var i = n.id;
                    (n.name = $(n)
                      .attr('data-name')
                      .replace(/%index%/, t)),
                      (n.id = $(n)
                        .attr('data-id')
                        .replace(/%index%/, t)),
                      ((
                        $(n).siblings('label')[0] ||
                        $(n).parents('label')[0] ||
                        e.find('[for="' + i + '"]')[0]
                      ).htmlFor = n.id);
                  });
                }),
                (t.AddAnother.prototype.createRemoveButton = function (t) {
                  t.append(
                    '<button type="button" class="govuk-button govuk-button--secondary moj-add-another__remove-button">Remove</button>'
                  );
                }),
                (t.AddAnother.prototype.resetItem = function (t) {
                  t.find('[data-name], [data-id]').each(function (t, e) {
                    'checkbox' == e.type || 'radio' == e.type ? (e.checked = !1) : (e.value = '');
                  });
                }),
                (t.AddAnother.prototype.onRemoveButtonClick = function (t) {
                  $(t.currentTarget).parents('.moj-add-another__item').remove();
                  var e = this.getItems();
                  1 === e.length && e.find('.moj-add-another__remove-button').remove(),
                    e.each(
                      $.proxy(function (t, e) {
                        this.updateAttributes(t, $(e));
                      }, this)
                    ),
                    this.focusHeading();
                }),
                (t.AddAnother.prototype.focusHeading = function () {
                  this.container.find('.moj-add-another__heading').focus();
                }),
                (t.ButtonMenu = function (t) {
                  (this.container = t.container),
                    (this.menu = this.container.find('.moj-button-menu__wrapper')),
                    t.menuClasses && this.menu.addClass(t.menuClasses),
                    this.menu.attr('role', 'menu'),
                    (this.mq = t.mq),
                    (this.buttonText = t.buttonText),
                    (this.buttonClasses = t.buttonClasses || ''),
                    (this.keys = { esc: 27, up: 38, down: 40, tab: 9 }),
                    this.menu.on('keydown', '[role=menuitem]', $.proxy(this, 'onButtonKeydown')),
                    this.createToggleButton(),
                    this.setupResponsiveChecks(),
                    $(document).on('click', $.proxy(this, 'onDocumentClick'));
                }),
                (t.ButtonMenu.prototype.onDocumentClick = function (t) {
                  $.contains(this.container[0], t.target) || this.hideMenu();
                }),
                (t.ButtonMenu.prototype.createToggleButton = function () {
                  (this.menuButton = $(
                    '<button class="govuk-button moj-button-menu__toggle-button ' +
                      this.buttonClasses +
                      '" type="button" aria-haspopup="true" aria-expanded="false">' +
                      this.buttonText +
                      '</button>'
                  )),
                    this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick')),
                    this.menuButton.on('keydown', $.proxy(this, 'onMenuKeyDown'));
                }),
                (t.ButtonMenu.prototype.setupResponsiveChecks = function () {
                  (this.mql = window.matchMedia(this.mq)),
                    this.mql.addListener($.proxy(this, 'checkMode')),
                    this.checkMode(this.mql);
                }),
                (t.ButtonMenu.prototype.checkMode = function (t) {
                  t.matches ? this.enableBigMode() : this.enableSmallMode();
                }),
                (t.ButtonMenu.prototype.enableSmallMode = function () {
                  this.container.prepend(this.menuButton),
                    this.hideMenu(),
                    this.removeButtonClasses(),
                    this.menu.attr('role', 'menu'),
                    this.container.find('.moj-button-menu__item').attr('role', 'menuitem');
                }),
                (t.ButtonMenu.prototype.enableBigMode = function () {
                  this.menuButton.detach(),
                    this.showMenu(),
                    this.addButtonClasses(),
                    this.menu.removeAttr('role'),
                    this.container.find('.moj-button-menu__item').removeAttr('role');
                }),
                (t.ButtonMenu.prototype.removeButtonClasses = function () {
                  this.menu.find('.moj-button-menu__item').each(function (t, e) {
                    $(e).hasClass('govuk-button--secondary') &&
                      ($(e).attr('data-secondary', 'true'), $(e).removeClass('govuk-button--secondary')),
                      $(e).hasClass('govuk-button--warning') &&
                        ($(e).attr('data-warning', 'true'), $(e).removeClass('govuk-button--warning')),
                      $(e).removeClass('govuk-button');
                  });
                }),
                (t.ButtonMenu.prototype.addButtonClasses = function () {
                  this.menu.find('.moj-button-menu__item').each(function (t, e) {
                    'true' == $(e).attr('data-secondary') && $(e).addClass('govuk-button--secondary'),
                      'true' == $(e).attr('data-warning') && $(e).addClass('govuk-button--warning'),
                      $(e).addClass('govuk-button');
                  });
                }),
                (t.ButtonMenu.prototype.hideMenu = function () {
                  this.menuButton.attr('aria-expanded', 'false');
                }),
                (t.ButtonMenu.prototype.showMenu = function () {
                  this.menuButton.attr('aria-expanded', 'true');
                }),
                (t.ButtonMenu.prototype.onMenuButtonClick = function () {
                  this.toggle();
                }),
                (t.ButtonMenu.prototype.toggle = function () {
                  'false' == this.menuButton.attr('aria-expanded')
                    ? (this.showMenu(), this.menu.find('[role=menuitem]').first().focus())
                    : (this.hideMenu(), this.menuButton.focus());
                }),
                (t.ButtonMenu.prototype.onMenuKeyDown = function (t) {
                  switch (t.keyCode) {
                    case this.keys.down:
                      this.toggle();
                  }
                }),
                (t.ButtonMenu.prototype.onButtonKeydown = function (t) {
                  switch (t.keyCode) {
                    case this.keys.up:
                      t.preventDefault(), this.focusPrevious(t.currentTarget);
                      break;
                    case this.keys.down:
                      t.preventDefault(), this.focusNext(t.currentTarget);
                      break;
                    case this.keys.esc:
                      this.mq.matches || (this.menuButton.focus(), this.hideMenu());
                      break;
                    case this.keys.tab:
                      this.mq.matches || this.hideMenu();
                  }
                }),
                (t.ButtonMenu.prototype.focusNext = function (t) {
                  var e = $(t).next();
                  e[0] ? e.focus() : this.container.find('[role=menuitem]').first().focus();
                }),
                (t.ButtonMenu.prototype.focusPrevious = function (t) {
                  var e = $(t).prev();
                  e[0] ? e.focus() : this.container.find('[role=menuitem]').last().focus();
                }),
                (t.FilterToggleButton = function (t) {
                  (this.options = t),
                    (this.container = this.options.toggleButton.container),
                    this.createToggleButton(),
                    this.setupResponsiveChecks(),
                    this.options.filter.container.attr('tabindex', '-1'),
                    this.options.startHidden && this.hideMenu();
                }),
                (t.FilterToggleButton.prototype.setupResponsiveChecks = function () {
                  (this.mq = window.matchMedia(this.options.bigModeMediaQuery)),
                    this.mq.addListener($.proxy(this, 'checkMode')),
                    this.checkMode(this.mq);
                }),
                (t.FilterToggleButton.prototype.createToggleButton = function () {
                  (this.menuButton = $(
                    '<button class="govuk-button ' +
                      this.options.toggleButton.classes +
                      '" type="button" aria-haspopup="true" aria-expanded="false">' +
                      this.options.toggleButton.showText +
                      '</button>'
                  )),
                    this.menuButton.on('click', $.proxy(this, 'onMenuButtonClick')),
                    this.options.toggleButton.container.append(this.menuButton);
                }),
                (t.FilterToggleButton.prototype.checkMode = function (t) {
                  t.matches ? this.enableBigMode() : this.enableSmallMode();
                }),
                (t.FilterToggleButton.prototype.enableBigMode = function () {
                  this.showMenu(), this.removeCloseButton();
                }),
                (t.FilterToggleButton.prototype.enableSmallMode = function () {
                  this.hideMenu(), this.addCloseButton();
                }),
                (t.FilterToggleButton.prototype.addCloseButton = function () {
                  this.options.closeButton &&
                    ((this.closeButton = $(
                      '<button class="moj-filter__close" type="button">' + this.options.closeButton.text + '</button>'
                    )),
                    this.closeButton.on('click', $.proxy(this, 'onCloseClick')),
                    this.options.closeButton.container.append(this.closeButton));
                }),
                (t.FilterToggleButton.prototype.onCloseClick = function () {
                  this.hideMenu(), this.menuButton.focus();
                }),
                (t.FilterToggleButton.prototype.removeCloseButton = function () {
                  this.closeButton && (this.closeButton.remove(), (this.closeButton = null));
                }),
                (t.FilterToggleButton.prototype.hideMenu = function () {
                  this.menuButton.attr('aria-expanded', 'false'),
                    this.options.filter.container.addClass('moj-js-hidden'),
                    this.menuButton.text(this.options.toggleButton.showText);
                }),
                (t.FilterToggleButton.prototype.showMenu = function () {
                  this.menuButton.attr('aria-expanded', 'true'),
                    this.options.filter.container.removeClass('moj-js-hidden'),
                    this.menuButton.text(this.options.toggleButton.hideText);
                }),
                (t.FilterToggleButton.prototype.onMenuButtonClick = function () {
                  this.toggle();
                }),
                (t.FilterToggleButton.prototype.toggle = function () {
                  'false' == this.menuButton.attr('aria-expanded')
                    ? (this.showMenu(), this.options.filter.container.focus())
                    : this.hideMenu();
                }),
                (t.FormValidator = function (t, e) {
                  (this.form = t),
                    (this.errors = []),
                    (this.validators = []),
                    $(this.form).on('submit', $.proxy(this, 'onSubmit')),
                    (this.summary = e && e.summary ? $(e.summary) : $('.govuk-error-summary')),
                    (this.originalTitle = document.title);
                }),
                (t.FormValidator.entityMap = {
                  '&': '&amp;',
                  '<': '&lt;',
                  '>': '&gt;',
                  '"': '&quot;',
                  "'": '&#39;',
                  '/': '&#x2F;',
                  '`': '&#x60;',
                  '=': '&#x3D;',
                }),
                (t.FormValidator.prototype.escapeHtml = function (e) {
                  return String(e).replace(/[&<>"'`=\/]/g, function (e) {
                    return t.FormValidator.entityMap[e];
                  });
                }),
                (t.FormValidator.prototype.resetTitle = function () {
                  document.title = this.originalTitle;
                }),
                (t.FormValidator.prototype.updateTitle = function () {
                  document.title = this.errors.length + ' errors - ' + document.title;
                }),
                (t.FormValidator.prototype.showSummary = function () {
                  this.summary.html(this.getSummaryHtml()),
                    this.summary.removeClass('moj-hidden'),
                    this.summary.attr('aria-labelledby', 'errorSummary-heading'),
                    this.summary.focus();
                }),
                (t.FormValidator.prototype.getSummaryHtml = function () {
                  var t = '<h2 id="error-summary-title" class="govuk-error-summary__title">There is a problem</h2>';
                  (t += '<div class="govuk-error-summary__body">'),
                    (t += '<ul class="govuk-list govuk-error-summary__list">');
                  for (var e = 0, o = this.errors.length; e < o; e++) {
                    var n = this.errors[e];
                    (t += '<li>'),
                      (t += '<a href="#' + this.escapeHtml(n.fieldName) + '">'),
                      (t += this.escapeHtml(n.message)),
                      (t += '</a>'),
                      (t += '</li>');
                  }
                  return (t += '</ul>') + '</div>';
                }),
                (t.FormValidator.prototype.hideSummary = function () {
                  this.summary.addClass('moj-hidden'), this.summary.removeAttr('aria-labelledby');
                }),
                (t.FormValidator.prototype.onSubmit = function (t) {
                  this.removeInlineErrors(),
                    this.hideSummary(),
                    this.resetTitle(),
                    this.validate() ||
                      (t.preventDefault(), this.updateTitle(), this.showSummary(), this.showInlineErrors());
                }),
                (t.FormValidator.prototype.showInlineErrors = function () {
                  for (var t = 0, e = this.errors.length; t < e; t++) this.showInlineError(this.errors[t]);
                }),
                (t.FormValidator.prototype.showInlineError = function (e) {
                  var o = e.fieldName + '-error',
                    n = '<span class="govuk-error-message" id="' + o + '">' + this.escapeHtml(e.message) + '</span>',
                    i = $('#' + e.fieldName),
                    r = i.parents('.govuk-form-group'),
                    a = r.find('label'),
                    s = r.find('legend'),
                    l = r.find('fieldset');
                  r.addClass('govuk-form-group--error'),
                    s.length
                      ? (s.after(n), r.attr('aria-invalid', 'true'), t.addAttributeValue(l[0], 'aria-describedby', o))
                      : (a.after(n), i.attr('aria-invalid', 'true'), t.addAttributeValue(i[0], 'aria-describedby', o));
                }),
                (t.FormValidator.prototype.removeInlineErrors = function () {
                  for (var t = 0; t < this.errors.length; t++) this.removeInlineError(this.errors[t]);
                }),
                (t.FormValidator.prototype.removeInlineError = function (e) {
                  var o = $('#' + e.fieldName).parents('.govuk-form-group');
                  o.find('.govuk-error-message').remove(),
                    o.removeClass('govuk-form-group--error'),
                    o.find('[aria-invalid]').attr('aria-invalid', 'false');
                  var n = e.fieldName + '-error';
                  t.removeAttributeValue(o.find('[aria-describedby]')[0], 'aria-describedby', n);
                }),
                (t.FormValidator.prototype.addValidator = function (t, e) {
                  this.validators.push({ fieldName: t, rules: e, field: this.form.elements[t] });
                }),
                (t.FormValidator.prototype.validate = function () {
                  this.errors = [];
                  var t,
                    e,
                    o = null,
                    n = !0;
                  for (t = 0; t < this.validators.length; t++)
                    for (o = this.validators[t], e = 0; e < o.rules.length; e++) {
                      if ('boolean' == typeof (n = o.rules[e].method(o.field, o.rules[e].params)) && !n) {
                        this.errors.push({ fieldName: o.fieldName, message: o.rules[e].message });
                        break;
                      }
                      if ('string' == typeof n) {
                        this.errors.push({ fieldName: n, message: o.rules[e].message });
                        break;
                      }
                    }
                  return 0 === this.errors.length;
                }),
                t.dragAndDropSupported() &&
                  t.formDataSupported() &&
                  t.fileApiSupported() &&
                  ((t.MultiFileUpload = function (t) {
                    (this.defaultParams = {
                      uploadFileEntryHook: $.noop,
                      uploadFileExitHook: $.noop,
                      uploadFileErrorHook: $.noop,
                      fileDeleteHook: $.noop,
                      uploadStatusText: 'Uploading files, please wait',
                      dropzoneHintText: 'Drag and drop files here or',
                      dropzoneButtonText: 'Choose files',
                    }),
                      (this.params = $.extend({}, this.defaultParams, t)),
                      this.params.container.addClass('moj-multi-file-upload--enhanced'),
                      (this.feedbackContainer = this.params.container.find('.moj-multi-file__uploaded-files')),
                      this.setupFileInput(),
                      this.setupDropzone(),
                      this.setupLabel(),
                      this.setupStatusBox(),
                      this.params.container.on(
                        'click',
                        '.moj-multi-file-upload__delete',
                        $.proxy(this, 'onFileDeleteClick')
                      );
                  }),
                  (t.MultiFileUpload.prototype.setupDropzone = function () {
                    this.fileInput.wrap('<div class="moj-multi-file-upload__dropzone" />'),
                      (this.dropzone = this.params.container.find('.moj-multi-file-upload__dropzone')),
                      this.dropzone.on('dragover', $.proxy(this, 'onDragOver')),
                      this.dropzone.on('dragleave', $.proxy(this, 'onDragLeave')),
                      this.dropzone.on('drop', $.proxy(this, 'onDrop'));
                  }),
                  (t.MultiFileUpload.prototype.setupLabel = function () {
                    (this.label = $(
                      '<label for="' +
                        this.fileInput[0].id +
                        '" class="govuk-button govuk-button--secondary">' +
                        this.params.dropzoneButtonText +
                        '</label>'
                    )),
                      this.dropzone.append('<p class="govuk-body">' + this.params.dropzoneHintText + '</p>'),
                      this.dropzone.append(this.label);
                  }),
                  (t.MultiFileUpload.prototype.setupFileInput = function () {
                    (this.fileInput = this.params.container.find('.moj-multi-file-upload__input')),
                      this.fileInput.on('change', $.proxy(this, 'onFileChange')),
                      this.fileInput.on('focus', $.proxy(this, 'onFileFocus')),
                      this.fileInput.on('blur', $.proxy(this, 'onFileBlur'));
                  }),
                  (t.MultiFileUpload.prototype.setupStatusBox = function () {
                    (this.status = $('<div aria-live="polite" role="status" class="govuk-visually-hidden" />')),
                      this.dropzone.append(this.status);
                  }),
                  (t.MultiFileUpload.prototype.onDragOver = function (t) {
                    t.preventDefault(), this.dropzone.addClass('moj-multi-file-upload--dragover');
                  }),
                  (t.MultiFileUpload.prototype.onDragLeave = function () {
                    this.dropzone.removeClass('moj-multi-file-upload--dragover');
                  }),
                  (t.MultiFileUpload.prototype.onDrop = function (t) {
                    t.preventDefault(),
                      this.dropzone.removeClass('moj-multi-file-upload--dragover'),
                      this.feedbackContainer.removeClass('moj-hidden'),
                      this.status.html(this.params.uploadStatusText),
                      this.uploadFiles(t.originalEvent.dataTransfer.files);
                  }),
                  (t.MultiFileUpload.prototype.uploadFiles = function (t) {
                    for (var e = 0; e < t.length; e++) this.uploadFile(t[e]);
                  }),
                  (t.MultiFileUpload.prototype.onFileChange = function (t) {
                    this.feedbackContainer.removeClass('moj-hidden'),
                      this.status.html(this.params.uploadStatusText),
                      this.uploadFiles(t.currentTarget.files),
                      this.fileInput.replaceWith($(t.currentTarget).val('').clone(!0)),
                      this.setupFileInput(),
                      this.fileInput.focus();
                  }),
                  (t.MultiFileUpload.prototype.onFileFocus = function (t) {
                    this.label.addClass('moj-multi-file-upload--focused');
                  }),
                  (t.MultiFileUpload.prototype.onFileBlur = function (t) {
                    this.label.removeClass('moj-multi-file-upload--focused');
                  }),
                  (t.MultiFileUpload.prototype.getSuccessHtml = function (t) {
                    return (
                      '<span class="moj-multi-file-upload__success"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/></svg> ' +
                      t.messageHtml +
                      '</span>'
                    );
                  }),
                  (t.MultiFileUpload.prototype.getErrorHtml = function (t) {
                    return (
                      '<span class="moj-multi-file-upload__error"> <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25"><path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/></svg> ' +
                      t.message +
                      '</span>'
                    );
                  }),
                  (t.MultiFileUpload.prototype.getFileRowHtml = function (t) {
                    var e = '';
                    return (
                      (e += '<div class="govuk-summary-list__row moj-multi-file-upload__row">'),
                      (e += '  <dd class="govuk-summary-list__value moj-multi-file-upload__message">'),
                      (e += '<span class="moj-multi-file-upload__filename">' + t.name + '</span>'),
                      (e += '<span class="moj-multi-file-upload__progress">0%</span>'),
                      (e += '  </dd>'),
                      (e += '  <dd class="govuk-summary-list__actions moj-multi-file-upload__actions"></dd>') + '</div>'
                    );
                  }),
                  (t.MultiFileUpload.prototype.getDeleteButtonHtml = function (t) {
                    var e =
                      '<button class="moj-multi-file-upload__delete govuk-button govuk-button--secondary govuk-!-margin-bottom-0" type="button" name="delete" value="' +
                      t.filename +
                      '">';
                    return (
                      (e += 'Delete <span class="govuk-visually-hidden">' + t.originalname + '</span>') + '</button>'
                    );
                  }),
                  (t.MultiFileUpload.prototype.uploadFile = function (t) {
                    this.params.uploadFileEntryHook(this, t);
                    var e = new FormData();
                    e.append('documents', t);
                    var o = $(this.getFileRowHtml(t));
                    this.feedbackContainer.find('.moj-multi-file-upload__list').append(o),
                      $.ajax({
                        url: this.params.uploadUrl,
                        type: 'post',
                        data: e,
                        processData: !1,
                        contentType: !1,
                        success: $.proxy(function (e) {
                          e.error
                            ? (o.find('.moj-multi-file-upload__message').html(this.getErrorHtml(e.error)),
                              this.status.html(e.error.message))
                            : (o.find('.moj-multi-file-upload__message').html(this.getSuccessHtml(e.success)),
                              this.status.html(e.success.messageText)),
                            o.find('.moj-multi-file-upload__actions').append(this.getDeleteButtonHtml(e.file)),
                            this.params.uploadFileExitHook(this, t, e);
                        }, this),
                        error: $.proxy(function (e, o, n) {
                          this.params.uploadFileErrorHook(this, t, e, o, n);
                        }, this),
                        xhr: function () {
                          var t = new XMLHttpRequest();
                          return (
                            t.upload.addEventListener(
                              'progress',
                              function (t) {
                                if (t.lengthComputable) {
                                  var e = t.loaded / t.total;
                                  (e = parseInt(100 * e, 10)),
                                    o.find('.moj-multi-file-upload__progress').text(' ' + e + '%');
                                }
                              },
                              !1
                            ),
                            t
                          );
                        },
                      });
                  }),
                  (t.MultiFileUpload.prototype.onFileDeleteClick = function (t) {
                    t.preventDefault();
                    var e = $(t.currentTarget),
                      o = {};
                    (o[e[0].name] = e[0].value),
                      $.ajax({
                        url: this.params.deleteUrl,
                        type: 'post',
                        dataType: 'json',
                        data: o,
                        success: $.proxy(function (t) {
                          t.error ||
                            (e.parents('.moj-multi-file-upload__row').remove(),
                            0 === this.feedbackContainer.find('.moj-multi-file-upload__row').length &&
                              this.feedbackContainer.addClass('moj-hidden')),
                            this.params.fileDeleteHook(this, t);
                        }, this),
                      });
                  })),
                (t.MultiSelect = function (t) {
                  (this.container = $(t.container)),
                    this.container.data('moj-multi-select-initialised') ||
                      (this.container.data('moj-multi-select-initialised', !0),
                      (this.toggle = $(this.getToggleHtml())),
                      (this.toggleButton = this.toggle.find('input')),
                      this.toggleButton.on('click', $.proxy(this, 'onButtonClick')),
                      this.container.append(this.toggle),
                      (this.checkboxes = $(t.checkboxes)),
                      this.checkboxes.on('click', $.proxy(this, 'onCheckboxClick')),
                      (this.checked = t.checked || !1));
                }),
                (t.MultiSelect.prototype.getToggleHtml = function () {
                  var t = '';
                  return (
                    (t += '<div class="govuk-checkboxes__item govuk-checkboxes--small moj-multi-select__checkbox">'),
                    (t += '  <input type="checkbox" class="govuk-checkboxes__input" id="checkboxes-all">'),
                    (t +=
                      '  <label class="govuk-label govuk-checkboxes__label moj-multi-select__toggle-label" for="checkboxes-all">'),
                    (t += '    <span class="govuk-visually-hidden">Select all</span>'),
                    (t += '  </label>') + '</div>'
                  );
                }),
                (t.MultiSelect.prototype.onButtonClick = function (t) {
                  this.checked
                    ? (this.uncheckAll(), (this.toggleButton[0].checked = !1))
                    : (this.checkAll(), (this.toggleButton[0].checked = !0));
                }),
                (t.MultiSelect.prototype.checkAll = function () {
                  this.checkboxes.each(
                    $.proxy(function (t, e) {
                      e.checked = !0;
                    }, this)
                  ),
                    (this.checked = !0);
                }),
                (t.MultiSelect.prototype.uncheckAll = function () {
                  this.checkboxes.each(
                    $.proxy(function (t, e) {
                      e.checked = !1;
                    }, this)
                  ),
                    (this.checked = !1);
                }),
                (t.MultiSelect.prototype.onCheckboxClick = function (t) {
                  t.target.checked
                    ? this.checkboxes.filter(':checked').length === this.checkboxes.length &&
                      ((this.toggleButton[0].checked = !0), (this.checked = !0))
                    : ((this.toggleButton[0].checked = !1), (this.checked = !1));
                }),
                (t.PasswordReveal = function (t) {
                  (this.el = t),
                    ($el = $(this.el)),
                    $el.data('moj-password-reveal-initialised') ||
                      ($el.data('moj-password-reveal-initialised', !0),
                      $el.wrap('<div class="moj-password-reveal"></div>'),
                      (this.container = $(this.el).parent()),
                      this.createButton());
                }),
                (t.PasswordReveal.prototype.createButton = function () {
                  (this.button = $(
                    '<button type="button" class="govuk-button govuk-button--secondary moj-password-reveal__button">Show</button>'
                  )),
                    this.container.append(this.button),
                    this.button.on('click', $.proxy(this, 'onButtonClick'));
                }),
                (t.PasswordReveal.prototype.onButtonClick = function () {
                  'password' === this.el.type
                    ? ((this.el.type = 'text'), this.button.text('Hide'))
                    : ((this.el.type = 'password'), this.button.text('Show'));
                }),
                'contentEditable' in document.documentElement &&
                  ((t.RichTextEditor = function (t) {
                    (this.options = t),
                      (this.options.toolbar = this.options.toolbar || {
                        bold: !1,
                        italic: !1,
                        underline: !1,
                        bullets: !0,
                        numbers: !0,
                      }),
                      (this.textarea = this.options.textarea),
                      (this.container = $(this.textarea).parent()),
                      this.container.data('moj-rich-text-editor-initialised') ||
                        (this.container.data('moj-rich-text-editor-initialised', !0),
                        this.createToolbar(),
                        this.hideDefault(),
                        this.configureToolbar(),
                        (this.keys = { left: 37, right: 39, up: 38, down: 40 }),
                        this.container.on(
                          'click',
                          '.moj-rich-text-editor__toolbar-button',
                          $.proxy(this, 'onButtonClick')
                        ),
                        this.container
                          .find('.moj-rich-text-editor__content')
                          .on('input', $.proxy(this, 'onEditorInput')),
                        this.container.find('label').on('click', $.proxy(this, 'onLabelClick')),
                        this.toolbar.on('keydown', $.proxy(this, 'onToolbarKeydown')));
                  }),
                  (t.RichTextEditor.prototype.onToolbarKeydown = function (t) {
                    var e;
                    switch (t.keyCode) {
                      case this.keys.right:
                      case this.keys.down:
                        var o = (e = this.toolbar.find('button[tabindex=0]')).next('button');
                        o[0] && (o.focus(), e.attr('tabindex', '-1'), o.attr('tabindex', '0'));
                        break;
                      case this.keys.left:
                      case this.keys.up:
                        var n = (e = this.toolbar.find('button[tabindex=0]')).prev('button');
                        n[0] && (n.focus(), e.attr('tabindex', '-1'), n.attr('tabindex', '0'));
                    }
                  }),
                  (t.RichTextEditor.prototype.getToolbarHtml = function () {
                    var t = '';
                    return (
                      (t += '<div class="moj-rich-text-editor__toolbar" role="toolbar">'),
                      this.options.toolbar.bold &&
                        (t +=
                          '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--bold" type="button" data-command="bold"><span class="govuk-visually-hidden">Bold</span></button>'),
                      this.options.toolbar.italic &&
                        (t +=
                          '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--italic" type="button" data-command="italic"><span class="govuk-visually-hidden">Italic</span></button>'),
                      this.options.toolbar.underline &&
                        (t +=
                          '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--underline" type="button" data-command="underline"><span class="govuk-visually-hidden">Underline</span></button>'),
                      this.options.toolbar.bullets &&
                        (t +=
                          '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--unordered-list" type="button" data-command="insertUnorderedList"><span class="govuk-visually-hidden">Unordered list</span></button>'),
                      this.options.toolbar.numbers &&
                        (t +=
                          '<button class="moj-rich-text-editor__toolbar-button moj-rich-text-editor__toolbar-button--ordered-list" type="button" data-command="insertOrderedList"><span class="govuk-visually-hidden">Ordered list</span></button>'),
                      t + '</div>'
                    );
                  }),
                  (t.RichTextEditor.prototype.getEnhancedHtml = function (t) {
                    return (
                      this.getToolbarHtml() +
                      '<div class="moj-rich-text-editor__content" contenteditable="true" spellcheck="false"></div>'
                    );
                  }),
                  (t.RichTextEditor.prototype.hideDefault = function () {
                    (this.textarea = this.container.find('textarea')),
                      this.textarea.addClass('govuk-visually-hidden'),
                      this.textarea.attr('aria-hidden', !0),
                      this.textarea.attr('tabindex', '-1');
                  }),
                  (t.RichTextEditor.prototype.createToolbar = function () {
                    (this.toolbar = document.createElement('div')),
                      (this.toolbar.className = 'moj-rich-text-editor'),
                      (this.toolbar.innerHTML = this.getEnhancedHtml()),
                      this.container.append(this.toolbar),
                      (this.toolbar = this.container.find('.moj-rich-text-editor__toolbar')),
                      this.container.find('.moj-rich-text-editor__content').html(this.textarea.val());
                  }),
                  (t.RichTextEditor.prototype.configureToolbar = function () {
                    (this.buttons = this.container.find('.moj-rich-text-editor__toolbar-button')),
                      this.buttons.prop('tabindex', '-1'),
                      this.buttons.first().prop('tabindex', '0');
                  }),
                  (t.RichTextEditor.prototype.onButtonClick = function (t) {
                    document.execCommand($(t.currentTarget).data('command'), !1, null);
                  }),
                  (t.RichTextEditor.prototype.getContent = function () {
                    return this.container.find('.moj-rich-text-editor__content').html();
                  }),
                  (t.RichTextEditor.prototype.onEditorInput = function (t) {
                    this.updateTextarea();
                  }),
                  (t.RichTextEditor.prototype.updateTextarea = function () {
                    document.execCommand('defaultParagraphSeparator', !1, 'p'), this.textarea.val(this.getContent());
                  }),
                  (t.RichTextEditor.prototype.onLabelClick = function (t) {
                    t.preventDefault(), this.container.find('.moj-rich-text-editor__content').focus();
                  })),
                (t.SearchToggle = function (t) {
                  (this.options = t),
                    this.options.search.container.data('moj-search-toggle-initialised') ||
                      (this.options.search.container.data('moj-search-toggle-initialised', !0),
                      (this.toggleButton = $(
                        '<button class="moj-search-toggle__button" type="button" aria-haspopup="true" aria-expanded="false">' +
                          this.options.toggleButton.text +
                          '</button>'
                      )),
                      this.toggleButton.on('click', $.proxy(this, 'onToggleButtonClick')),
                      this.options.toggleButton.container.append(this.toggleButton));
                }),
                (t.SearchToggle.prototype.onToggleButtonClick = function () {
                  'false' == this.toggleButton.attr('aria-expanded')
                    ? (this.toggleButton.attr('aria-expanded', 'true'),
                      this.options.search.container.removeClass('moj-js-hidden'),
                      this.options.search.container.find('input').first().focus())
                    : (this.options.search.container.addClass('moj-js-hidden'),
                      this.toggleButton.attr('aria-expanded', 'false'));
                }),
                (t.SortableTable = function (t) {
                  (this.table = $(t.table)),
                    this.table.data('moj-search-toggle-initialised') ||
                      (this.table.data('moj-search-toggle-initialised', !0),
                      this.setupOptions(t),
                      (this.body = this.table.find('tbody')),
                      this.createHeadingButtons(),
                      this.createStatusBox(),
                      this.table.on('click', 'th button', $.proxy(this, 'onSortButtonClick')));
                }),
                (t.SortableTable.prototype.setupOptions = function (t) {
                  (t = t || {}),
                    (this.statusMessage = t.statusMessage || 'Sort by %heading% (%direction%)'),
                    (this.ascendingText = t.ascendingText || 'ascending'),
                    (this.descendingText = t.descendingText || 'descending');
                }),
                (t.SortableTable.prototype.createHeadingButtons = function () {
                  for (var t, e = this.table.find('thead th'), o = 0; o < e.length; o++)
                    (t = $(e[o])).attr('aria-sort') && this.createHeadingButton(t, o);
                }),
                (t.SortableTable.prototype.createHeadingButton = function (t, e) {
                  var o = t.text(),
                    n = $('<button type="button" data-index="' + e + '">' + o + '</button>');
                  t.text(''), t.append(n);
                }),
                (t.SortableTable.prototype.createStatusBox = function () {
                  (this.status = $(
                    '<div aria-live="polite" role="status" aria-atomic="true" class="govuk-visually-hidden" />'
                  )),
                    this.table.parent().append(this.status);
                }),
                (t.SortableTable.prototype.onSortButtonClick = function (t) {
                  var e,
                    o = t.currentTarget.getAttribute('data-index'),
                    n = $(t.currentTarget).parent().attr('aria-sort');
                  e = 'none' === n || 'descending' === n ? 'ascending' : 'descending';
                  var i = this.getTableRowsArray(),
                    r = this.sort(i, o, e);
                  this.addRows(r), this.removeButtonStates(), this.updateButtonState($(t.currentTarget), e);
                }),
                (t.SortableTable.prototype.updateButtonState = function (t, e) {
                  t.parent().attr('aria-sort', e);
                  var o = this.statusMessage;
                  (o = (o = o.replace(/%heading%/, t.text())).replace(/%direction%/, this[e + 'Text'])),
                    this.status.text(o);
                }),
                (t.SortableTable.prototype.removeButtonStates = function () {
                  this.table.find('thead th').attr('aria-sort', 'none');
                }),
                (t.SortableTable.prototype.addRows = function (t) {
                  for (var e = 0; e < t.length; e++) this.body.append(t[e]);
                }),
                (t.SortableTable.prototype.getTableRowsArray = function () {
                  for (var t = [], e = this.body.find('tr'), o = 0; o < e.length; o++) t.push(e[o]);
                  return t;
                }),
                (t.SortableTable.prototype.sort = function (t, e, o) {
                  return t.sort(
                    $.proxy(function (t, n) {
                      var i = $(t).find('td').eq(e),
                        r = $(n).find('td').eq(e),
                        a = this.getCellValue(i),
                        s = this.getCellValue(r);
                      return 'ascending' === o ? (a < s ? -1 : a > s ? 1 : 0) : s < a ? -1 : s > a ? 1 : 0;
                    }, this)
                  );
                }),
                (t.SortableTable.prototype.getCellValue = function (t) {
                  var e = t.attr('data-sort-value');
                  return (e = e || t.html()), $.isNumeric(e) && (e = parseInt(e, 10)), e;
                }),
                t
              );
            })
              ? o.apply(e, [])
              : o) || (t.exports = n);
      },
      152: function (t) {
        var e;
        (e = function () {
          return (function () {
            var t = {
                134: function (t, e, o) {
                  'use strict';
                  o.d(e, {
                    default: function () {
                      return y;
                    },
                  });
                  var n = o(279),
                    i = o.n(n),
                    r = o(370),
                    a = o.n(r),
                    s = o(817),
                    l = o.n(s);
                  function u(t) {
                    return (u =
                      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                        ? function (t) {
                            return typeof t;
                          }
                        : function (t) {
                            return t &&
                              'function' == typeof Symbol &&
                              t.constructor === Symbol &&
                              t !== Symbol.prototype
                              ? 'symbol'
                              : typeof t;
                          })(t);
                  }
                  function c(t, e) {
                    for (var o = 0; o < e.length; o++) {
                      var n = e[o];
                      (n.enumerable = n.enumerable || !1),
                        (n.configurable = !0),
                        'value' in n && (n.writable = !0),
                        Object.defineProperty(t, n.key, n);
                    }
                  }
                  var d = (function () {
                    function t(e) {
                      !(function (t, e) {
                        if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                      })(this, t),
                        this.resolveOptions(e),
                        this.initSelection();
                    }
                    var e, o;
                    return (
                      (e = t),
                      (o = [
                        {
                          key: 'resolveOptions',
                          value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            (this.action = t.action),
                              (this.container = t.container),
                              (this.emitter = t.emitter),
                              (this.target = t.target),
                              (this.text = t.text),
                              (this.trigger = t.trigger),
                              (this.selectedText = '');
                          },
                        },
                        {
                          key: 'initSelection',
                          value: function () {
                            this.text ? this.selectFake() : this.target && this.selectTarget();
                          },
                        },
                        {
                          key: 'createFakeElement',
                          value: function () {
                            var t = 'rtl' === document.documentElement.getAttribute('dir');
                            (this.fakeElem = document.createElement('textarea')),
                              (this.fakeElem.style.fontSize = '12pt'),
                              (this.fakeElem.style.border = '0'),
                              (this.fakeElem.style.padding = '0'),
                              (this.fakeElem.style.margin = '0'),
                              (this.fakeElem.style.position = 'absolute'),
                              (this.fakeElem.style[t ? 'right' : 'left'] = '-9999px');
                            var e = window.pageYOffset || document.documentElement.scrollTop;
                            return (
                              (this.fakeElem.style.top = ''.concat(e, 'px')),
                              this.fakeElem.setAttribute('readonly', ''),
                              (this.fakeElem.value = this.text),
                              this.fakeElem
                            );
                          },
                        },
                        {
                          key: 'selectFake',
                          value: function () {
                            var t = this,
                              e = this.createFakeElement();
                            (this.fakeHandlerCallback = function () {
                              return t.removeFake();
                            }),
                              (this.fakeHandler =
                                this.container.addEventListener('click', this.fakeHandlerCallback) || !0),
                              this.container.appendChild(e),
                              (this.selectedText = l()(e)),
                              this.copyText(),
                              this.removeFake();
                          },
                        },
                        {
                          key: 'removeFake',
                          value: function () {
                            this.fakeHandler &&
                              (this.container.removeEventListener('click', this.fakeHandlerCallback),
                              (this.fakeHandler = null),
                              (this.fakeHandlerCallback = null)),
                              this.fakeElem && (this.container.removeChild(this.fakeElem), (this.fakeElem = null));
                          },
                        },
                        {
                          key: 'selectTarget',
                          value: function () {
                            (this.selectedText = l()(this.target)), this.copyText();
                          },
                        },
                        {
                          key: 'copyText',
                          value: function () {
                            var t;
                            try {
                              t = document.execCommand(this.action);
                            } catch (e) {
                              t = !1;
                            }
                            this.handleResult(t);
                          },
                        },
                        {
                          key: 'handleResult',
                          value: function (t) {
                            this.emitter.emit(t ? 'success' : 'error', {
                              action: this.action,
                              text: this.selectedText,
                              trigger: this.trigger,
                              clearSelection: this.clearSelection.bind(this),
                            });
                          },
                        },
                        {
                          key: 'clearSelection',
                          value: function () {
                            this.trigger && this.trigger.focus(),
                              document.activeElement.blur(),
                              window.getSelection().removeAllRanges();
                          },
                        },
                        {
                          key: 'destroy',
                          value: function () {
                            this.removeFake();
                          },
                        },
                        {
                          key: 'action',
                          set: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 'copy';
                            if (((this._action = t), 'copy' !== this._action && 'cut' !== this._action))
                              throw new Error('Invalid "action" value, use either "copy" or "cut"');
                          },
                          get: function () {
                            return this._action;
                          },
                        },
                        {
                          key: 'target',
                          set: function (t) {
                            if (void 0 !== t) {
                              if (!t || 'object' !== u(t) || 1 !== t.nodeType)
                                throw new Error('Invalid "target" value, use a valid Element');
                              if ('copy' === this.action && t.hasAttribute('disabled'))
                                throw new Error(
                                  'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                                );
                              if ('cut' === this.action && (t.hasAttribute('readonly') || t.hasAttribute('disabled')))
                                throw new Error(
                                  'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                                );
                              this._target = t;
                            }
                          },
                          get: function () {
                            return this._target;
                          },
                        },
                      ]) && c(e.prototype, o),
                      t
                    );
                  })();
                  function h(t) {
                    return (h =
                      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
                        ? function (t) {
                            return typeof t;
                          }
                        : function (t) {
                            return t &&
                              'function' == typeof Symbol &&
                              t.constructor === Symbol &&
                              t !== Symbol.prototype
                              ? 'symbol'
                              : typeof t;
                          })(t);
                  }
                  function p(t, e) {
                    for (var o = 0; o < e.length; o++) {
                      var n = e[o];
                      (n.enumerable = n.enumerable || !1),
                        (n.configurable = !0),
                        'value' in n && (n.writable = !0),
                        Object.defineProperty(t, n.key, n);
                    }
                  }
                  function f(t, e) {
                    return (f =
                      Object.setPrototypeOf ||
                      function (t, e) {
                        return (t.__proto__ = e), t;
                      })(t, e);
                  }
                  function m(t, e) {
                    return !e || ('object' !== h(e) && 'function' != typeof e)
                      ? (function (t) {
                          if (void 0 === t)
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                          return t;
                        })(t)
                      : e;
                  }
                  function b(t) {
                    return (b = Object.setPrototypeOf
                      ? Object.getPrototypeOf
                      : function (t) {
                          return t.__proto__ || Object.getPrototypeOf(t);
                        })(t);
                  }
                  function g(t, e) {
                    var o = 'data-clipboard-'.concat(t);
                    if (e.hasAttribute(o)) return e.getAttribute(o);
                  }
                  var y = (function (t) {
                    !(function (t, e) {
                      if ('function' != typeof e && null !== e)
                        throw new TypeError('Super expression must either be null or a function');
                      (t.prototype = Object.create(e && e.prototype, {
                        constructor: { value: t, writable: !0, configurable: !0 },
                      })),
                        e && f(t, e);
                    })(l, t);
                    var e,
                      o,
                      n,
                      i,
                      r,
                      s =
                        ((i = l),
                        (r = (function () {
                          if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
                          if (Reflect.construct.sham) return !1;
                          if ('function' == typeof Proxy) return !0;
                          try {
                            return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
                          } catch (t) {
                            return !1;
                          }
                        })()),
                        function () {
                          var t,
                            e = b(i);
                          if (r) {
                            var o = b(this).constructor;
                            t = Reflect.construct(e, arguments, o);
                          } else t = e.apply(this, arguments);
                          return m(this, t);
                        });
                    function l(t, e) {
                      var o;
                      return (
                        (function (t, e) {
                          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
                        })(this, l),
                        (o = s.call(this)).resolveOptions(e),
                        o.listenClick(t),
                        o
                      );
                    }
                    return (
                      (e = l),
                      (n = [
                        {
                          key: 'isSupported',
                          value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : ['copy', 'cut'],
                              e = 'string' == typeof t ? [t] : t,
                              o = !!document.queryCommandSupported;
                            return (
                              e.forEach(function (t) {
                                o = o && !!document.queryCommandSupported(t);
                              }),
                              o
                            );
                          },
                        },
                      ]),
                      (o = [
                        {
                          key: 'resolveOptions',
                          value: function () {
                            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                            (this.action = 'function' == typeof t.action ? t.action : this.defaultAction),
                              (this.target = 'function' == typeof t.target ? t.target : this.defaultTarget),
                              (this.text = 'function' == typeof t.text ? t.text : this.defaultText),
                              (this.container = 'object' === h(t.container) ? t.container : document.body);
                          },
                        },
                        {
                          key: 'listenClick',
                          value: function (t) {
                            var e = this;
                            this.listener = a()(t, 'click', function (t) {
                              return e.onClick(t);
                            });
                          },
                        },
                        {
                          key: 'onClick',
                          value: function (t) {
                            var e = t.delegateTarget || t.currentTarget;
                            this.clipboardAction && (this.clipboardAction = null),
                              (this.clipboardAction = new d({
                                action: this.action(e),
                                target: this.target(e),
                                text: this.text(e),
                                container: this.container,
                                trigger: e,
                                emitter: this,
                              }));
                          },
                        },
                        {
                          key: 'defaultAction',
                          value: function (t) {
                            return g('action', t);
                          },
                        },
                        {
                          key: 'defaultTarget',
                          value: function (t) {
                            var e = g('target', t);
                            if (e) return document.querySelector(e);
                          },
                        },
                        {
                          key: 'defaultText',
                          value: function (t) {
                            return g('text', t);
                          },
                        },
                        {
                          key: 'destroy',
                          value: function () {
                            this.listener.destroy(),
                              this.clipboardAction && (this.clipboardAction.destroy(), (this.clipboardAction = null));
                          },
                        },
                      ]) && p(e.prototype, o),
                      n && p(e, n),
                      l
                    );
                  })(i());
                },
                828: function (t) {
                  if ('undefined' != typeof Element && !Element.prototype.matches) {
                    var e = Element.prototype;
                    e.matches =
                      e.matchesSelector ||
                      e.mozMatchesSelector ||
                      e.msMatchesSelector ||
                      e.oMatchesSelector ||
                      e.webkitMatchesSelector;
                  }
                  t.exports = function (t, e) {
                    for (; t && 9 !== t.nodeType; ) {
                      if ('function' == typeof t.matches && t.matches(e)) return t;
                      t = t.parentNode;
                    }
                  };
                },
                438: function (t, e, o) {
                  var n = o(828);
                  function i(t, e, o, n, i) {
                    var a = r.apply(this, arguments);
                    return (
                      t.addEventListener(o, a, i),
                      {
                        destroy: function () {
                          t.removeEventListener(o, a, i);
                        },
                      }
                    );
                  }
                  function r(t, e, o, i) {
                    return function (o) {
                      (o.delegateTarget = n(o.target, e)), o.delegateTarget && i.call(t, o);
                    };
                  }
                  t.exports = function (t, e, o, n, r) {
                    return 'function' == typeof t.addEventListener
                      ? i.apply(null, arguments)
                      : 'function' == typeof o
                      ? i.bind(null, document).apply(null, arguments)
                      : ('string' == typeof t && (t = document.querySelectorAll(t)),
                        Array.prototype.map.call(t, function (t) {
                          return i(t, e, o, n, r);
                        }));
                  };
                },
                879: function (t, e) {
                  (e.node = function (t) {
                    return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType;
                  }),
                    (e.nodeList = function (t) {
                      var o = Object.prototype.toString.call(t);
                      return (
                        void 0 !== t &&
                        ('[object NodeList]' === o || '[object HTMLCollection]' === o) &&
                        'length' in t &&
                        (0 === t.length || e.node(t[0]))
                      );
                    }),
                    (e.string = function (t) {
                      return 'string' == typeof t || t instanceof String;
                    }),
                    (e.fn = function (t) {
                      return '[object Function]' === Object.prototype.toString.call(t);
                    });
                },
                370: function (t, e, o) {
                  var n = o(879),
                    i = o(438);
                  t.exports = function (t, e, o) {
                    if (!t && !e && !o) throw new Error('Missing required arguments');
                    if (!n.string(e)) throw new TypeError('Second argument must be a String');
                    if (!n.fn(o)) throw new TypeError('Third argument must be a Function');
                    if (n.node(t))
                      return (function (t, e, o) {
                        return (
                          t.addEventListener(e, o),
                          {
                            destroy: function () {
                              t.removeEventListener(e, o);
                            },
                          }
                        );
                      })(t, e, o);
                    if (n.nodeList(t))
                      return (function (t, e, o) {
                        return (
                          Array.prototype.forEach.call(t, function (t) {
                            t.addEventListener(e, o);
                          }),
                          {
                            destroy: function () {
                              Array.prototype.forEach.call(t, function (t) {
                                t.removeEventListener(e, o);
                              });
                            },
                          }
                        );
                      })(t, e, o);
                    if (n.string(t))
                      return (function (t, e, o) {
                        return i(document.body, t, e, o);
                      })(t, e, o);
                    throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
                  };
                },
                817: function (t) {
                  t.exports = function (t) {
                    var e;
                    if ('SELECT' === t.nodeName) t.focus(), (e = t.value);
                    else if ('INPUT' === t.nodeName || 'TEXTAREA' === t.nodeName) {
                      var o = t.hasAttribute('readonly');
                      o || t.setAttribute('readonly', ''),
                        t.select(),
                        t.setSelectionRange(0, t.value.length),
                        o || t.removeAttribute('readonly'),
                        (e = t.value);
                    } else {
                      t.hasAttribute('contenteditable') && t.focus();
                      var n = window.getSelection(),
                        i = document.createRange();
                      i.selectNodeContents(t), n.removeAllRanges(), n.addRange(i), (e = n.toString());
                    }
                    return e;
                  };
                },
                279: function (t) {
                  function e() {}
                  (e.prototype = {
                    on: function (t, e, o) {
                      var n = this.e || (this.e = {});
                      return (n[t] || (n[t] = [])).push({ fn: e, ctx: o }), this;
                    },
                    once: function (t, e, o) {
                      var n = this;
                      function i() {
                        n.off(t, i), e.apply(o, arguments);
                      }
                      return (i._ = e), this.on(t, i, o);
                    },
                    emit: function (t) {
                      for (
                        var e = [].slice.call(arguments, 1),
                          o = ((this.e || (this.e = {}))[t] || []).slice(),
                          n = 0,
                          i = o.length;
                        n < i;
                        n++
                      )
                        o[n].fn.apply(o[n].ctx, e);
                      return this;
                    },
                    off: function (t, e) {
                      var o = this.e || (this.e = {}),
                        n = o[t],
                        i = [];
                      if (n && e)
                        for (var r = 0, a = n.length; r < a; r++) n[r].fn !== e && n[r].fn._ !== e && i.push(n[r]);
                      return i.length ? (o[t] = i) : delete o[t], this;
                    },
                  }),
                    (t.exports = e),
                    (t.exports.TinyEmitter = e);
                },
              },
              e = {};
            function o(n) {
              if (e[n]) return e[n].exports;
              var i = (e[n] = { exports: {} });
              return t[n](i, i.exports, o), i.exports;
            }
            return (
              (o.n = function (t) {
                var e =
                  t && t.__esModule
                    ? function () {
                        return t.default;
                      }
                    : function () {
                        return t;
                      };
                return o.d(e, { a: e }), e;
              }),
              (o.d = function (t, e) {
                for (var n in e) o.o(e, n) && !o.o(t, n) && Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
              }),
              (o.o = function (t, e) {
                return Object.prototype.hasOwnProperty.call(t, e);
              }),
              o(134)
            );
          })().default;
        }),
          (t.exports = e());
      },
      4: function (t, e, o) {
        !(function (t) {
          'use strict';
          function e(t, e) {
            if (window.NodeList.prototype.forEach) return t.forEach(e);
            for (var o = 0; o < t.length; o++) e.call(window, t[o], o, t);
          }
          function n(t) {
            (this.$module = t),
              (this.moduleId = t.getAttribute('id')),
              (this.$sections = t.querySelectorAll('.govuk-accordion__section')),
              (this.$openAllButton = ''),
              (this.browserSupportsSessionStorage = i.checkForSessionStorage()),
              (this.controlsClass = 'govuk-accordion__controls'),
              (this.openAllClass = 'govuk-accordion__open-all'),
              (this.iconClass = 'govuk-accordion__icon'),
              (this.sectionHeaderClass = 'govuk-accordion__section-header'),
              (this.sectionHeaderFocusedClass = 'govuk-accordion__section-header--focused'),
              (this.sectionHeadingClass = 'govuk-accordion__section-heading'),
              (this.sectionSummaryClass = 'govuk-accordion__section-summary'),
              (this.sectionButtonClass = 'govuk-accordion__section-button'),
              (this.sectionExpandedClass = 'govuk-accordion__section--expanded');
          }
          (function (t) {
            var e, o, n, i;
            ('defineProperty' in Object &&
              (function () {
                try {
                  return Object.defineProperty({}, 'test', { value: 42 }), !0;
                } catch (t) {
                  return !1;
                }
              })()) ||
              ((e = Object.defineProperty),
              (o = Object.prototype.hasOwnProperty('__defineGetter__')),
              (n = 'Getters & setters cannot be defined on this javascript engine'),
              (i = 'A property cannot both have accessors and be writable or have a value'),
              (Object.defineProperty = function (t, r, a) {
                if (e && (t === window || t === document || t === Element.prototype || t instanceof Element))
                  return e(t, r, a);
                if (null === t || !(t instanceof Object || 'object' == typeof t))
                  throw new TypeError('Object.defineProperty called on non-object');
                if (!(a instanceof Object)) throw new TypeError('Property description must be an object');
                var s = String(r),
                  l = 'value' in a || 'writable' in a,
                  u = 'get' in a && typeof a.get,
                  c = 'set' in a && typeof a.set;
                if (u) {
                  if ('function' !== u) throw new TypeError('Getter must be a function');
                  if (!o) throw new TypeError(n);
                  if (l) throw new TypeError(i);
                  Object.__defineGetter__.call(t, s, a.get);
                } else t[s] = a.value;
                if (c) {
                  if ('function' !== c) throw new TypeError('Setter must be a function');
                  if (!o) throw new TypeError(n);
                  if (l) throw new TypeError(i);
                  Object.__defineSetter__.call(t, s, a.set);
                }
                return 'value' in a && (t[s] = a.value), t;
              }));
          }.call(
            ('object' == typeof window && window) ||
              ('object' == typeof self && self) ||
              ('object' == typeof o.g && o.g) ||
              {}
          ),
            function (t) {
              'bind' in Function.prototype ||
                Object.defineProperty(Function.prototype, 'bind', {
                  value: function (t) {
                    var e,
                      o = Array,
                      n = Object,
                      i = n.prototype,
                      r = o.prototype,
                      a = function () {},
                      s = i.toString,
                      l = 'function' == typeof Symbol && 'symbol' == typeof Symbol.toStringTag,
                      u = Function.prototype.toString,
                      c = function (t) {
                        try {
                          return u.call(t), !0;
                        } catch (t) {
                          return !1;
                        }
                      },
                      d = '[object Function]',
                      h = '[object GeneratorFunction]';
                    e = function (t) {
                      if ('function' != typeof t) return !1;
                      if (l) return c(t);
                      var e = s.call(t);
                      return e === d || e === h;
                    };
                    var p = r.slice,
                      f = r.concat,
                      m = r.push,
                      b = Math.max,
                      g = this;
                    if (!e(g)) throw new TypeError('Function.prototype.bind called on incompatible ' + g);
                    for (
                      var y,
                        v = p.call(arguments, 1),
                        w = function () {
                          if (this instanceof y) {
                            var e = g.apply(this, f.call(v, p.call(arguments)));
                            return n(e) === e ? e : this;
                          }
                          return g.apply(t, f.call(v, p.call(arguments)));
                        },
                        k = b(0, g.length - v.length),
                        x = [],
                        E = 0;
                      E < k;
                      E++
                    )
                      m.call(x, '$' + E);
                    return (
                      (y = Function(
                        'binder',
                        'return function (' + x.join(',') + '){ return binder.apply(this, arguments); }'
                      )(w)),
                      g.prototype && ((a.prototype = g.prototype), (y.prototype = new a()), (a.prototype = null)),
                      y
                    );
                  },
                });
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              var e, o, n;
              ('DOMTokenList' in this &&
                (!('classList' in (e = document.createElement('x'))) ||
                  (!e.classList.toggle('x', !1) && !e.className))) ||
                (('DOMTokenList' in (o = this) &&
                  o.DOMTokenList &&
                  (!document.createElementNS ||
                    !document.createElementNS('http://www.w3.org/2000/svg', 'svg') ||
                    document.createElementNS('http://www.w3.org/2000/svg', 'svg').classList instanceof DOMTokenList)) ||
                  (o.DOMTokenList = (function () {
                    var e = !0,
                      o = function (t, o, n, i) {
                        Object.defineProperty
                          ? Object.defineProperty(t, o, { configurable: !1 === e || !!i, get: n })
                          : t.__defineGetter__(o, n);
                      };
                    try {
                      o({}, 'support');
                    } catch (t) {
                      e = !1;
                    }
                    return function (e, n) {
                      var i = this,
                        r = [],
                        a = {},
                        s = 0,
                        l = 0,
                        u = function (t) {
                          o(
                            i,
                            t,
                            function () {
                              return d(), r[t];
                            },
                            !1
                          );
                        },
                        c = function () {
                          if (s >= l) for (; l < s; ++l) u(l);
                        },
                        d = function () {
                          var t,
                            o,
                            i = arguments,
                            l = /\s+/;
                          if (i.length)
                            for (o = 0; o < i.length; ++o)
                              if (l.test(i[o]))
                                throw (
                                  (((t = new SyntaxError(
                                    'String "' + i[o] + '" contains an invalid character'
                                  )).code = 5),
                                  (t.name = 'InvalidCharacterError'),
                                  t)
                                );
                          for (
                            '' ===
                              (r =
                                'object' == typeof e[n]
                                  ? ('' + e[n].baseVal).replace(/^\s+|\s+$/g, '').split(l)
                                  : ('' + e[n]).replace(/^\s+|\s+$/g, '').split(l))[0] && (r = []),
                              a = {},
                              o = 0;
                            o < r.length;
                            ++o
                          )
                            a[r[o]] = !0;
                          (s = r.length), c();
                        };
                      return (
                        d(),
                        o(i, 'length', function () {
                          return d(), s;
                        }),
                        (i.toLocaleString = i.toString =
                          function () {
                            return d(), r.join(' ');
                          }),
                        (i.item = function (t) {
                          return d(), r[t];
                        }),
                        (i.contains = function (t) {
                          return d(), !!a[t];
                        }),
                        (i.add = function () {
                          d.apply(i, (t = arguments));
                          for (var t, o, l = 0, u = t.length; l < u; ++l) (o = t[l]), a[o] || (r.push(o), (a[o] = !0));
                          s !== r.length &&
                            ((s = r.length >>> 0),
                            'object' == typeof e[n] ? (e[n].baseVal = r.join(' ')) : (e[n] = r.join(' ')),
                            c());
                        }),
                        (i.remove = function () {
                          d.apply(i, (t = arguments));
                          for (var t, o = {}, l = 0, u = []; l < t.length; ++l) (o[t[l]] = !0), delete a[t[l]];
                          for (l = 0; l < r.length; ++l) o[r[l]] || u.push(r[l]);
                          (r = u),
                            (s = u.length >>> 0),
                            'object' == typeof e[n] ? (e[n].baseVal = r.join(' ')) : (e[n] = r.join(' ')),
                            c();
                        }),
                        (i.toggle = function (e, o) {
                          return (
                            d.apply(i, [e]),
                            t !== o
                              ? o
                                ? (i.add(e), !0)
                                : (i.remove(e), !1)
                              : a[e]
                              ? (i.remove(e), !1)
                              : (i.add(e), !0)
                          );
                        }),
                        i
                      );
                    };
                  })()),
                'classList' in (n = document.createElement('span')) &&
                  (n.classList.toggle('x', !1),
                  n.classList.contains('x') &&
                    (n.classList.constructor.prototype.toggle = function (e) {
                      var o = arguments[1];
                      if (o === t) {
                        var n = !this.contains(e);
                        return this[n ? 'add' : 'remove'](e), n;
                      }
                      return this[(o = !!o) ? 'add' : 'remove'](e), o;
                    })),
                (function () {
                  var t = document.createElement('span');
                  if ('classList' in t && (t.classList.add('a', 'b'), !t.classList.contains('b'))) {
                    var e = t.classList.constructor.prototype.add;
                    t.classList.constructor.prototype.add = function () {
                      for (var t = arguments, o = arguments.length, n = 0; n < o; n++) e.call(this, t[n]);
                    };
                  }
                })(),
                (function () {
                  var t = document.createElement('span');
                  if (
                    'classList' in t &&
                    (t.classList.add('a'),
                    t.classList.add('b'),
                    t.classList.remove('a', 'b'),
                    t.classList.contains('b'))
                  ) {
                    var e = t.classList.constructor.prototype.remove;
                    t.classList.constructor.prototype.remove = function () {
                      for (var t = arguments, o = arguments.length, n = 0; n < o; n++) e.call(this, t[n]);
                    };
                  }
                })());
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              'Document' in this ||
                ('undefined' == typeof WorkerGlobalScope &&
                  'function' != typeof importScripts &&
                  (this.HTMLDocument
                    ? (this.Document = this.HTMLDocument)
                    : ((this.Document =
                        this.HTMLDocument =
                        document.constructor =
                          new Function('return function Document() {}')()),
                      (this.Document.prototype = document))));
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              ('Element' in this && 'HTMLElement' in this) ||
                (function () {
                  if (!window.Element || window.HTMLElement) {
                    window.Element = window.HTMLElement = new Function('return function Element() {}')();
                    var t,
                      e = document.appendChild(document.createElement('body')),
                      o = e.appendChild(document.createElement('iframe')).contentWindow.document,
                      n = (Element.prototype = o.appendChild(o.createElement('*'))),
                      i = {},
                      r = function (t, e) {
                        var o,
                          n,
                          a,
                          s = t.childNodes || [],
                          l = -1;
                        if (1 === t.nodeType && t.constructor !== Element)
                          for (o in ((t.constructor = Element), i)) (n = i[o]), (t[o] = n);
                        for (; (a = e && s[++l]); ) r(a, e);
                        return t;
                      },
                      a = document.getElementsByTagName('*'),
                      s = document.createElement,
                      l = 100;
                    n.attachEvent('onpropertychange', function (t) {
                      for (
                        var e, o = t.propertyName, r = !i.hasOwnProperty(o), s = n[o], l = i[o], u = -1;
                        (e = a[++u]);

                      )
                        1 === e.nodeType && (r || e[o] === l) && (e[o] = s);
                      i[o] = s;
                    }),
                      (n.constructor = Element),
                      n.hasAttribute ||
                        (n.hasAttribute = function (t) {
                          return null !== this.getAttribute(t);
                        }),
                      u() || ((document.onreadystatechange = u), (t = setInterval(u, 25))),
                      (document.createElement = function (t) {
                        var e = s(String(t).toLowerCase());
                        return r(e);
                      }),
                      document.removeChild(e);
                  } else window.HTMLElement = window.Element;
                  function u() {
                    return (
                      l-- || clearTimeout(t),
                      !(
                        !document.body ||
                        document.body.prototype ||
                        !/(complete|interactive)/.test(document.readyState) ||
                        (r(document, !0), t && document.body.prototype && clearTimeout(t), !document.body.prototype)
                      )
                    );
                  }
                })();
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              var e;
              ('document' in this &&
                'classList' in document.documentElement &&
                'Element' in this &&
                'classList' in Element.prototype &&
                ((e = document.createElement('span')).classList.add('a', 'b'), e.classList.contains('b'))) ||
                (function (t) {
                  var e = !0,
                    o = function (t, o, n, i) {
                      Object.defineProperty
                        ? Object.defineProperty(t, o, { configurable: !1 === e || !!i, get: n })
                        : t.__defineGetter__(o, n);
                    };
                  try {
                    o({}, 'support');
                  } catch (t) {
                    e = !1;
                  }
                  var n = function (t, i, r) {
                    o(
                      t.prototype,
                      i,
                      function () {
                        var t,
                          a = this,
                          s = '__defineGetter__DEFINE_PROPERTY' + i;
                        if (a[s]) return t;
                        if (((a[s] = !0), !1 === e)) {
                          for (
                            var l, u = n.mirror || document.createElement('div'), c = u.childNodes, d = c.length, h = 0;
                            h < d;
                            ++h
                          )
                            if (c[h]._R === a) {
                              l = c[h];
                              break;
                            }
                          l || (l = u.appendChild(document.createElement('div'))), (t = DOMTokenList.call(l, a, r));
                        } else t = new DOMTokenList(a, r);
                        return (
                          o(a, i, function () {
                            return t;
                          }),
                          delete a[s],
                          t
                        );
                      },
                      !0
                    );
                  };
                  n(t.Element, 'classList', 'className'),
                    n(t.HTMLElement, 'classList', 'className'),
                    n(t.HTMLLinkElement, 'relList', 'rel'),
                    n(t.HTMLAnchorElement, 'relList', 'rel'),
                    n(t.HTMLAreaElement, 'relList', 'rel');
                })(this);
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            (n.prototype.init = function () {
              if (this.$module) {
                this.initControls(), this.initSectionHeaders();
                var t = this.checkIfAllSectionsOpen();
                this.updateOpenAllButton(t);
              }
            }),
            (n.prototype.initControls = function () {
              (this.$openAllButton = document.createElement('button')),
                this.$openAllButton.setAttribute('type', 'button'),
                (this.$openAllButton.innerHTML = 'Open all <span class="govuk-visually-hidden">sections</span>'),
                this.$openAllButton.setAttribute('class', this.openAllClass),
                this.$openAllButton.setAttribute('aria-expanded', 'false'),
                this.$openAllButton.setAttribute('type', 'button');
              var t = document.createElement('div');
              t.setAttribute('class', this.controlsClass),
                t.appendChild(this.$openAllButton),
                this.$module.insertBefore(t, this.$module.firstChild),
                this.$openAllButton.addEventListener('click', this.onOpenOrCloseAllToggle.bind(this));
            }),
            (n.prototype.initSectionHeaders = function () {
              e(
                this.$sections,
                function (t, e) {
                  var o = t.querySelector('.' + this.sectionHeaderClass);
                  this.initHeaderAttributes(o, e),
                    this.setExpanded(this.isExpanded(t), t),
                    o.addEventListener('click', this.onSectionToggle.bind(this, t)),
                    this.setInitialState(t);
                }.bind(this)
              );
            }),
            (n.prototype.initHeaderAttributes = function (t, e) {
              var o = this,
                n = t.querySelector('.' + this.sectionButtonClass),
                i = t.querySelector('.' + this.sectionHeadingClass),
                r = t.querySelector('.' + this.sectionSummaryClass),
                a = document.createElement('button');
              a.setAttribute('type', 'button'),
                a.setAttribute('id', this.moduleId + '-heading-' + (e + 1)),
                a.setAttribute('aria-controls', this.moduleId + '-content-' + (e + 1));
              for (var s = 0; s < n.attributes.length; s++) {
                var l = n.attributes.item(s);
                a.setAttribute(l.nodeName, l.nodeValue);
              }
              a.addEventListener('focusin', function (e) {
                t.classList.contains(o.sectionHeaderFocusedClass) || (t.className += ' ' + o.sectionHeaderFocusedClass);
              }),
                a.addEventListener('blur', function (e) {
                  t.classList.remove(o.sectionHeaderFocusedClass);
                }),
                null != r && a.setAttribute('aria-describedby', this.moduleId + '-summary-' + (e + 1)),
                (a.innerHTML = n.innerHTML),
                i.removeChild(n),
                i.appendChild(a);
              var u = document.createElement('span');
              (u.className = this.iconClass), u.setAttribute('aria-hidden', 'true'), a.appendChild(u);
            }),
            (n.prototype.onSectionToggle = function (t) {
              var e = this.isExpanded(t);
              this.setExpanded(!e, t), this.storeState(t);
            }),
            (n.prototype.onOpenOrCloseAllToggle = function () {
              var t = this,
                o = this.$sections,
                n = !this.checkIfAllSectionsOpen();
              e(o, function (e) {
                t.setExpanded(n, e), t.storeState(e);
              }),
                t.updateOpenAllButton(n);
            }),
            (n.prototype.setExpanded = function (t, e) {
              e.querySelector('.' + this.sectionButtonClass).setAttribute('aria-expanded', t),
                t ? e.classList.add(this.sectionExpandedClass) : e.classList.remove(this.sectionExpandedClass);
              var o = this.checkIfAllSectionsOpen();
              this.updateOpenAllButton(o);
            }),
            (n.prototype.isExpanded = function (t) {
              return t.classList.contains(this.sectionExpandedClass);
            }),
            (n.prototype.checkIfAllSectionsOpen = function () {
              return this.$sections.length === this.$module.querySelectorAll('.' + this.sectionExpandedClass).length;
            }),
            (n.prototype.updateOpenAllButton = function (t) {
              var e = t ? 'Close all' : 'Open all';
              (e += '<span class="govuk-visually-hidden"> sections</span>'),
                this.$openAllButton.setAttribute('aria-expanded', t),
                (this.$openAllButton.innerHTML = e);
            }));
          var i = {
            checkForSessionStorage: function () {
              var t,
                e = 'this is the test string';
              try {
                return (
                  window.sessionStorage.setItem(e, e),
                  (t = window.sessionStorage.getItem(e) === e.toString()),
                  window.sessionStorage.removeItem(e),
                  t
                );
              } catch (t) {
                ('undefined' != typeof console && void 0 !== console.log) ||
                  console.log('Notice: sessionStorage not available.');
              }
            },
          };
          (n.prototype.storeState = function (t) {
            if (this.browserSupportsSessionStorage) {
              var e = t.querySelector('.' + this.sectionButtonClass);
              if (e) {
                var o = e.getAttribute('aria-controls'),
                  n = e.getAttribute('aria-expanded');
                void 0 !== o ||
                  ('undefined' != typeof console && void 0 !== console.log) ||
                  console.error(new Error('No aria controls present in accordion section heading.')),
                  void 0 !== n ||
                    ('undefined' != typeof console && void 0 !== console.log) ||
                    console.error(new Error('No aria expanded present in accordion section heading.')),
                  o && n && window.sessionStorage.setItem(o, n);
              }
            }
          }),
            (n.prototype.setInitialState = function (t) {
              if (this.browserSupportsSessionStorage) {
                var e = t.querySelector('.' + this.sectionButtonClass);
                if (e) {
                  var o = e.getAttribute('aria-controls'),
                    n = o ? window.sessionStorage.getItem(o) : null;
                  null !== n && this.setExpanded('true' === n, t);
                }
              }
            }),
            function (t) {
              'Window' in this ||
                ('undefined' == typeof WorkerGlobalScope &&
                  'function' != typeof importScripts &&
                  (function (t) {
                    t.constructor
                      ? (t.Window = t.constructor)
                      : ((t.Window = t.constructor = new Function('return function Window() {}')()).prototype = this);
                  })(this));
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              (function (t) {
                if (!('Event' in t)) return !1;
                if ('function' == typeof t.Event) return !0;
                try {
                  return new Event('click'), !0;
                } catch (t) {
                  return !1;
                }
              })(this) ||
                (function () {
                  var e = {
                    click: 1,
                    dblclick: 1,
                    keyup: 1,
                    keypress: 1,
                    keydown: 1,
                    mousedown: 1,
                    mouseup: 1,
                    mousemove: 1,
                    mouseover: 1,
                    mouseenter: 1,
                    mouseleave: 1,
                    mouseout: 1,
                    storage: 1,
                    storagecommit: 1,
                    textinput: 1,
                  };
                  if ('undefined' != typeof document && 'undefined' != typeof window) {
                    var o = (window.Event && window.Event.prototype) || null;
                    (window.Event = Window.prototype.Event =
                      function (e, o) {
                        if (!e) throw new Error('Not enough arguments');
                        var n;
                        if ('createEvent' in document) {
                          n = document.createEvent('Event');
                          var i = !(!o || o.bubbles === t) && o.bubbles,
                            r = !(!o || o.cancelable === t) && o.cancelable;
                          return n.initEvent(e, i, r), n;
                        }
                        return (
                          ((n = document.createEventObject()).type = e),
                          (n.bubbles = !(!o || o.bubbles === t) && o.bubbles),
                          (n.cancelable = !(!o || o.cancelable === t) && o.cancelable),
                          n
                        );
                      }),
                      o &&
                        Object.defineProperty(window.Event, 'prototype', {
                          configurable: !1,
                          enumerable: !1,
                          writable: !0,
                          value: o,
                        }),
                      'createEvent' in document ||
                        ((window.addEventListener =
                          Window.prototype.addEventListener =
                          Document.prototype.addEventListener =
                          Element.prototype.addEventListener =
                            function () {
                              var t = this,
                                o = arguments[0],
                                i = arguments[1];
                              if (t === window && o in e)
                                throw new Error(
                                  'In IE8 the event: ' +
                                    o +
                                    ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.'
                                );
                              t._events || (t._events = {}),
                                t._events[o] ||
                                  ((t._events[o] = function (e) {
                                    var o,
                                      i = t._events[e.type].list,
                                      r = i.slice(),
                                      a = -1,
                                      s = r.length;
                                    for (
                                      e.preventDefault = function () {
                                        !1 !== e.cancelable && (e.returnValue = !1);
                                      },
                                        e.stopPropagation = function () {
                                          e.cancelBubble = !0;
                                        },
                                        e.stopImmediatePropagation = function () {
                                          (e.cancelBubble = !0), (e.cancelImmediate = !0);
                                        },
                                        e.currentTarget = t,
                                        e.relatedTarget = e.fromElement || null,
                                        e.target = e.target || e.srcElement || t,
                                        e.timeStamp = new Date().getTime(),
                                        e.clientX &&
                                          ((e.pageX = e.clientX + document.documentElement.scrollLeft),
                                          (e.pageY = e.clientY + document.documentElement.scrollTop));
                                      ++a < s && !e.cancelImmediate;

                                    )
                                      a in r && -1 !== n(i, (o = r[a])) && 'function' == typeof o && o.call(t, e);
                                  }),
                                  (t._events[o].list = []),
                                  t.attachEvent && t.attachEvent('on' + o, t._events[o])),
                                t._events[o].list.push(i);
                            }),
                        (window.removeEventListener =
                          Window.prototype.removeEventListener =
                          Document.prototype.removeEventListener =
                          Element.prototype.removeEventListener =
                            function () {
                              var t,
                                e = this,
                                o = arguments[0],
                                i = arguments[1];
                              e._events &&
                                e._events[o] &&
                                e._events[o].list &&
                                -1 !== (t = n(e._events[o].list, i)) &&
                                (e._events[o].list.splice(t, 1),
                                e._events[o].list.length ||
                                  (e.detachEvent && e.detachEvent('on' + o, e._events[o]), delete e._events[o]));
                            }),
                        (window.dispatchEvent =
                          Window.prototype.dispatchEvent =
                          Document.prototype.dispatchEvent =
                          Element.prototype.dispatchEvent =
                            function (t) {
                              if (!arguments.length) throw new Error('Not enough arguments');
                              if (!t || 'string' != typeof t.type) throw new Error('DOM Events Exception 0');
                              var e = this,
                                o = t.type;
                              try {
                                if (!t.bubbles) {
                                  t.cancelBubble = !0;
                                  var n = function (t) {
                                    (t.cancelBubble = !0), (e || window).detachEvent('on' + o, n);
                                  };
                                  this.attachEvent('on' + o, n);
                                }
                                this.fireEvent('on' + o, t);
                              } catch (n) {
                                t.target = e;
                                do {
                                  (t.currentTarget = e),
                                    '_events' in e && 'function' == typeof e._events[o] && e._events[o].call(e, t),
                                    'function' == typeof e['on' + o] && e['on' + o].call(e, t),
                                    (e = 9 === e.nodeType ? e.parentWindow : e.parentNode);
                                } while (e && !t.cancelBubble);
                              }
                              return !0;
                            }),
                        document.attachEvent('onreadystatechange', function () {
                          'complete' === document.readyState &&
                            document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: !0 }));
                        }));
                  }
                  function n(t, e) {
                    for (var o = -1, n = t.length; ++o < n; ) if (o in t && t[o] === e) return o;
                    return -1;
                  }
                })();
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            );
          function r(t) {
            (this.$module = t), (this.debounceFormSubmitTimer = null);
          }
          (r.prototype.handleKeyDown = function (t) {
            var e = t.target;
            'button' === e.getAttribute('role') && 32 === t.keyCode && (t.preventDefault(), e.click());
          }),
            (r.prototype.debounce = function (t) {
              if ('true' === t.target.getAttribute('data-prevent-double-click'))
                return this.debounceFormSubmitTimer
                  ? (t.preventDefault(), !1)
                  : void (this.debounceFormSubmitTimer = setTimeout(
                      function () {
                        this.debounceFormSubmitTimer = null;
                      }.bind(this),
                      1e3
                    ));
            }),
            (r.prototype.init = function () {
              this.$module.addEventListener('keydown', this.handleKeyDown),
                this.$module.addEventListener('click', this.debounce);
            });
          function a(t) {
            this.$module = t;
          }
          function s(t) {
            (this.$module = t),
              (this.$textarea = t.querySelector('.govuk-js-character-count')),
              this.$textarea && (this.$countMessage = t.querySelector('[id="' + this.$textarea.id + '-info"]'));
          }
          function l(t) {
            (this.$module = t), (this.$inputs = t.querySelectorAll('input[type="checkbox"]'));
          }
          function u(t) {
            this.$module = t;
          }
          function c(t) {
            this.$module = t;
          }
          function d(t) {
            (this.$module = t),
              (this.$menuButton = t && t.querySelector('.govuk-js-header-toggle')),
              (this.$menu = this.$menuButton && t.querySelector('#' + this.$menuButton.getAttribute('aria-controls')));
          }
          function h(t) {
            (this.$module = t), (this.$inputs = t.querySelectorAll('input[type="radio"]'));
          }
          function p(t) {
            (this.$module = t),
              (this.$tabs = t.querySelectorAll('.govuk-tabs__tab')),
              (this.keys = { left: 37, right: 39, up: 38, down: 40 }),
              (this.jsHiddenClass = 'govuk-tabs__panel--hidden');
          }
          (a.prototype.init = function () {
            this.$module && ('boolean' == typeof this.$module.open || this.polyfillDetails());
          }),
            (a.prototype.polyfillDetails = function () {
              var t,
                e = this.$module,
                o = (this.$summary = e.getElementsByTagName('summary').item(0)),
                n = (this.$content = e.getElementsByTagName('div').item(0));
              o &&
                n &&
                (n.id ||
                  (n.id =
                    'details-content-' +
                    ((t = new Date().getTime()),
                    void 0 !== window.performance &&
                      'function' == typeof window.performance.now &&
                      (t += window.performance.now()),
                    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (e) {
                      var o = (t + 16 * Math.random()) % 16 | 0;
                      return (t = Math.floor(t / 16)), ('x' === e ? o : (3 & o) | 8).toString(16);
                    }))),
                e.setAttribute('role', 'group'),
                o.setAttribute('role', 'button'),
                o.setAttribute('aria-controls', n.id),
                (o.tabIndex = 0),
                1 == (null !== e.getAttribute('open'))
                  ? (o.setAttribute('aria-expanded', 'true'), n.setAttribute('aria-hidden', 'false'))
                  : (o.setAttribute('aria-expanded', 'false'),
                    n.setAttribute('aria-hidden', 'true'),
                    (n.style.display = 'none')),
                this.polyfillHandleInputs(o, this.polyfillSetAttributes.bind(this)));
            }),
            (a.prototype.polyfillSetAttributes = function () {
              var t = this.$module,
                e = this.$summary,
                o = this.$content,
                n = 'true' === e.getAttribute('aria-expanded'),
                i = 'true' === o.getAttribute('aria-hidden');
              return (
                e.setAttribute('aria-expanded', n ? 'false' : 'true'),
                o.setAttribute('aria-hidden', i ? 'false' : 'true'),
                (o.style.display = n ? 'none' : ''),
                null !== t.getAttribute('open') ? t.removeAttribute('open') : t.setAttribute('open', 'open'),
                !0
              );
            }),
            (a.prototype.polyfillHandleInputs = function (t, e) {
              t.addEventListener('keypress', function (t) {
                var o = t.target;
                (13 !== t.keyCode && 32 !== t.keyCode) ||
                  ('summary' === o.nodeName.toLowerCase() && (t.preventDefault(), o.click ? o.click() : e(t)));
              }),
                t.addEventListener('keyup', function (t) {
                  var e = t.target;
                  32 === t.keyCode && 'summary' === e.nodeName.toLowerCase() && t.preventDefault();
                }),
                t.addEventListener('click', e);
            }),
            (s.prototype.defaults = { characterCountAttribute: 'data-maxlength', wordCountAttribute: 'data-maxwords' }),
            (s.prototype.init = function () {
              var t = this.$module,
                e = this.$textarea,
                o = this.$countMessage;
              if (e && o) {
                e.insertAdjacentElement('afterend', o), (this.options = this.getDataset(t));
                var n = this.defaults.characterCountAttribute;
                this.options.maxwords && (n = this.defaults.wordCountAttribute),
                  (this.maxLength = t.getAttribute(n)),
                  this.maxLength &&
                    (t.removeAttribute('maxlength'),
                    'onpageshow' in window
                      ? window.addEventListener('pageshow', this.sync.bind(this))
                      : window.addEventListener('DOMContentLoaded', this.sync.bind(this)),
                    this.sync());
              }
            }),
            (s.prototype.sync = function () {
              this.bindChangeEvents(), this.updateCountMessage();
            }),
            (s.prototype.getDataset = function (t) {
              var e = {},
                o = t.attributes;
              if (o)
                for (var n = 0; n < o.length; n++) {
                  var i = o[n],
                    r = i.name.match(/^data-(.+)/);
                  r && (e[r[1]] = i.value);
                }
              return e;
            }),
            (s.prototype.count = function (t) {
              return this.options.maxwords ? (t.match(/\S+/g) || []).length : t.length;
            }),
            (s.prototype.bindChangeEvents = function () {
              var t = this.$textarea;
              t.addEventListener('keyup', this.checkIfValueChanged.bind(this)),
                t.addEventListener('focus', this.handleFocus.bind(this)),
                t.addEventListener('blur', this.handleBlur.bind(this));
            }),
            (s.prototype.checkIfValueChanged = function () {
              this.$textarea.oldValue || (this.$textarea.oldValue = ''),
                this.$textarea.value !== this.$textarea.oldValue &&
                  ((this.$textarea.oldValue = this.$textarea.value), this.updateCountMessage());
            }),
            (s.prototype.updateCountMessage = function () {
              var t = this.$textarea,
                e = this.options,
                o = this.$countMessage,
                n = this.count(t.value),
                i = this.maxLength,
                r = i - n;
              (i * (e.threshold ? e.threshold : 0)) / 100 > n
                ? (o.classList.add('govuk-character-count__message--disabled'), o.setAttribute('aria-hidden', !0))
                : (o.classList.remove('govuk-character-count__message--disabled'), o.removeAttribute('aria-hidden')),
                r < 0
                  ? (t.classList.add('govuk-textarea--error'),
                    o.classList.remove('govuk-hint'),
                    o.classList.add('govuk-error-message'))
                  : (t.classList.remove('govuk-textarea--error'),
                    o.classList.remove('govuk-error-message'),
                    o.classList.add('govuk-hint'));
              var a,
                s,
                l = 'character';
              e.maxwords && (l = 'word'),
                (l += -1 === r || 1 === r ? '' : 's'),
                (a = r < 0 ? 'too many' : 'remaining'),
                (s = Math.abs(r)),
                (o.innerHTML = 'You have ' + s + ' ' + l + ' ' + a);
            }),
            (s.prototype.handleFocus = function () {
              this.valueChecker = setInterval(this.checkIfValueChanged.bind(this), 1e3);
            }),
            (s.prototype.handleBlur = function () {
              clearInterval(this.valueChecker);
            }),
            (l.prototype.init = function () {
              var t = this.$module;
              e(this.$inputs, function (e) {
                var o = e.getAttribute('data-aria-controls');
                o &&
                  t.querySelector('#' + o) &&
                  (e.setAttribute('aria-controls', o), e.removeAttribute('data-aria-controls'));
              }),
                'onpageshow' in window
                  ? window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this))
                  : window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this)),
                this.syncAllConditionalReveals(),
                t.addEventListener('click', this.handleClick.bind(this));
            }),
            (l.prototype.syncAllConditionalReveals = function () {
              e(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
            }),
            (l.prototype.syncConditionalRevealWithInputState = function (t) {
              var e = this.$module.querySelector('#' + t.getAttribute('aria-controls'));
              if (e && e.classList.contains('govuk-checkboxes__conditional')) {
                var o = t.checked;
                t.setAttribute('aria-expanded', o), e.classList.toggle('govuk-checkboxes__conditional--hidden', !o);
              }
            }),
            (l.prototype.handleClick = function (t) {
              var e = t.target,
                o = 'checkbox' === e.getAttribute('type'),
                n = e.getAttribute('aria-controls');
              o && n && this.syncConditionalRevealWithInputState(e);
            }),
            function (t) {
              ('document' in this && 'matches' in document.documentElement) ||
                (Element.prototype.matches =
                  Element.prototype.webkitMatchesSelector ||
                  Element.prototype.oMatchesSelector ||
                  Element.prototype.msMatchesSelector ||
                  Element.prototype.mozMatchesSelector ||
                  function (t) {
                    for (
                      var e = this, o = (e.document || e.ownerDocument).querySelectorAll(t), n = 0;
                      o[n] && o[n] !== e;

                    )
                      ++n;
                    return !!o[n];
                  });
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              ('document' in this && 'closest' in document.documentElement) ||
                (Element.prototype.closest = function (t) {
                  for (var e = this; e; ) {
                    if (e.matches(t)) return e;
                    e = 'SVGElement' in window && e instanceof SVGElement ? e.parentNode : e.parentElement;
                  }
                  return null;
                });
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            (u.prototype.init = function () {
              var t = this.$module;
              t && (t.focus(), t.addEventListener('click', this.handleClick.bind(this)));
            }),
            (u.prototype.handleClick = function (t) {
              var e = t.target;
              this.focusTarget(e) && t.preventDefault();
            }),
            (u.prototype.focusTarget = function (t) {
              if ('A' !== t.tagName || !1 === t.href) return !1;
              var e = this.getFragmentFromUrl(t.href),
                o = document.getElementById(e);
              if (!o) return !1;
              var n = this.getAssociatedLegendOrLabel(o);
              return !!n && (n.scrollIntoView(), o.focus({ preventScroll: !0 }), !0);
            }),
            (u.prototype.getFragmentFromUrl = function (t) {
              return -1 !== t.indexOf('#') && t.split('#').pop();
            }),
            (u.prototype.getAssociatedLegendOrLabel = function (t) {
              var e = t.closest('fieldset');
              if (e) {
                var o = e.getElementsByTagName('legend');
                if (o.length) {
                  var n = o[0];
                  if ('checkbox' === t.type || 'radio' === t.type) return n;
                  var i = n.getBoundingClientRect().top,
                    r = t.getBoundingClientRect();
                  if (r.height && window.innerHeight && r.top + r.height - i < window.innerHeight / 2) return n;
                }
              }
              return document.querySelector("label[for='" + t.getAttribute('id') + "']") || t.closest('label');
            }),
            (c.prototype.init = function () {
              this.$module && this.setFocus();
            }),
            (c.prototype.setFocus = function () {
              var t = this.$module;
              'true' !== t.getAttribute('data-disable-auto-focus') &&
                'alert' === t.getAttribute('role') &&
                (t.getAttribute('tabindex') ||
                  (t.setAttribute('tabindex', '-1'),
                  t.addEventListener('blur', function () {
                    t.removeAttribute('tabindex');
                  })),
                t.focus());
            }),
            (d.prototype.init = function () {
              this.$module &&
                this.$menuButton &&
                this.$menu &&
                (this.syncState(this.$menu.classList.contains('govuk-header__navigation--open')),
                this.$menuButton.addEventListener('click', this.handleMenuButtonClick.bind(this)));
            }),
            (d.prototype.syncState = function (t) {
              this.$menuButton.classList.toggle('govuk-header__menu-button--open', t),
                this.$menuButton.setAttribute('aria-expanded', t);
            }),
            (d.prototype.handleMenuButtonClick = function () {
              var t = this.$menu.classList.toggle('govuk-header__navigation--open');
              this.syncState(t);
            }),
            (h.prototype.init = function () {
              var t = this.$module;
              e(this.$inputs, function (e) {
                var o = e.getAttribute('data-aria-controls');
                o &&
                  t.querySelector('#' + o) &&
                  (e.setAttribute('aria-controls', o), e.removeAttribute('data-aria-controls'));
              }),
                'onpageshow' in window
                  ? window.addEventListener('pageshow', this.syncAllConditionalReveals.bind(this))
                  : window.addEventListener('DOMContentLoaded', this.syncAllConditionalReveals.bind(this)),
                this.syncAllConditionalReveals(),
                t.addEventListener('click', this.handleClick.bind(this));
            }),
            (h.prototype.syncAllConditionalReveals = function () {
              e(this.$inputs, this.syncConditionalRevealWithInputState.bind(this));
            }),
            (h.prototype.syncConditionalRevealWithInputState = function (t) {
              var e = document.querySelector('#' + t.getAttribute('aria-controls'));
              if (e && e.classList.contains('govuk-radios__conditional')) {
                var o = t.checked;
                t.setAttribute('aria-expanded', o), e.classList.toggle('govuk-radios__conditional--hidden', !o);
              }
            }),
            (h.prototype.handleClick = function (t) {
              var o = t.target;
              'radio' === o.type &&
                e(
                  document.querySelectorAll('input[type="radio"][aria-controls]'),
                  function (t) {
                    var e = t.form === o.form;
                    t.name === o.name && e && this.syncConditionalRevealWithInputState(t);
                  }.bind(this)
                );
            }),
            function (t) {
              ('document' in this && 'nextElementSibling' in document.documentElement) ||
                Object.defineProperty(Element.prototype, 'nextElementSibling', {
                  get: function () {
                    for (var t = this.nextSibling; t && 1 !== t.nodeType; ) t = t.nextSibling;
                    return t;
                  },
                });
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            function (t) {
              ('document' in this && 'previousElementSibling' in document.documentElement) ||
                Object.defineProperty(Element.prototype, 'previousElementSibling', {
                  get: function () {
                    for (var t = this.previousSibling; t && 1 !== t.nodeType; ) t = t.previousSibling;
                    return t;
                  },
                });
            }.call(
              ('object' == typeof window && window) ||
                ('object' == typeof self && self) ||
                ('object' == typeof o.g && o.g) ||
                {}
            ),
            (p.prototype.init = function () {
              'function' == typeof window.matchMedia ? this.setupResponsiveChecks() : this.setup();
            }),
            (p.prototype.setupResponsiveChecks = function () {
              (this.mql = window.matchMedia('(min-width: 40.0625em)')),
                this.mql.addListener(this.checkMode.bind(this)),
                this.checkMode();
            }),
            (p.prototype.checkMode = function () {
              this.mql.matches ? this.setup() : this.teardown();
            }),
            (p.prototype.setup = function () {
              var t = this.$module,
                o = this.$tabs,
                n = t.querySelector('.govuk-tabs__list'),
                i = t.querySelectorAll('.govuk-tabs__list-item');
              if (o && n && i) {
                n.setAttribute('role', 'tablist'),
                  e(i, function (t) {
                    t.setAttribute('role', 'presentation');
                  }),
                  e(
                    o,
                    function (t) {
                      this.setAttributes(t),
                        (t.boundTabClick = this.onTabClick.bind(this)),
                        (t.boundTabKeydown = this.onTabKeydown.bind(this)),
                        t.addEventListener('click', t.boundTabClick, !0),
                        t.addEventListener('keydown', t.boundTabKeydown, !0),
                        this.hideTab(t);
                    }.bind(this)
                  );
                var r = this.getTab(window.location.hash) || this.$tabs[0];
                this.showTab(r),
                  (t.boundOnHashChange = this.onHashChange.bind(this)),
                  window.addEventListener('hashchange', t.boundOnHashChange, !0);
              }
            }),
            (p.prototype.teardown = function () {
              var t = this.$module,
                o = this.$tabs,
                n = t.querySelector('.govuk-tabs__list'),
                i = t.querySelectorAll('.govuk-tabs__list-item');
              o &&
                n &&
                i &&
                (n.removeAttribute('role'),
                e(i, function (t) {
                  t.removeAttribute('role', 'presentation');
                }),
                e(
                  o,
                  function (t) {
                    t.removeEventListener('click', t.boundTabClick, !0),
                      t.removeEventListener('keydown', t.boundTabKeydown, !0),
                      this.unsetAttributes(t);
                  }.bind(this)
                ),
                window.removeEventListener('hashchange', t.boundOnHashChange, !0));
            }),
            (p.prototype.onHashChange = function (t) {
              var e = window.location.hash,
                o = this.getTab(e);
              if (o)
                if (this.changingHash) this.changingHash = !1;
                else {
                  var n = this.getCurrentTab();
                  this.hideTab(n), this.showTab(o), o.focus();
                }
            }),
            (p.prototype.hideTab = function (t) {
              this.unhighlightTab(t), this.hidePanel(t);
            }),
            (p.prototype.showTab = function (t) {
              this.highlightTab(t), this.showPanel(t);
            }),
            (p.prototype.getTab = function (t) {
              return this.$module.querySelector('.govuk-tabs__tab[href="' + t + '"]');
            }),
            (p.prototype.setAttributes = function (t) {
              var e = this.getHref(t).slice(1);
              t.setAttribute('id', 'tab_' + e),
                t.setAttribute('role', 'tab'),
                t.setAttribute('aria-controls', e),
                t.setAttribute('aria-selected', 'false'),
                t.setAttribute('tabindex', '-1');
              var o = this.getPanel(t);
              o.setAttribute('role', 'tabpanel'),
                o.setAttribute('aria-labelledby', t.id),
                o.classList.add(this.jsHiddenClass);
            }),
            (p.prototype.unsetAttributes = function (t) {
              t.removeAttribute('id'),
                t.removeAttribute('role'),
                t.removeAttribute('aria-controls'),
                t.removeAttribute('aria-selected'),
                t.removeAttribute('tabindex');
              var e = this.getPanel(t);
              e.removeAttribute('role'), e.removeAttribute('aria-labelledby'), e.classList.remove(this.jsHiddenClass);
            }),
            (p.prototype.onTabClick = function (t) {
              if (!t.target.classList.contains('govuk-tabs__tab')) return !1;
              t.preventDefault();
              var e = t.target,
                o = this.getCurrentTab();
              this.hideTab(o), this.showTab(e), this.createHistoryEntry(e);
            }),
            (p.prototype.createHistoryEntry = function (t) {
              var e = this.getPanel(t),
                o = e.id;
              (e.id = ''), (this.changingHash = !0), (window.location.hash = this.getHref(t).slice(1)), (e.id = o);
            }),
            (p.prototype.onTabKeydown = function (t) {
              switch (t.keyCode) {
                case this.keys.left:
                case this.keys.up:
                  this.activatePreviousTab(), t.preventDefault();
                  break;
                case this.keys.right:
                case this.keys.down:
                  this.activateNextTab(), t.preventDefault();
              }
            }),
            (p.prototype.activateNextTab = function () {
              var t = this.getCurrentTab(),
                e = t.parentNode.nextElementSibling;
              if (e) var o = e.querySelector('.govuk-tabs__tab');
              o && (this.hideTab(t), this.showTab(o), o.focus(), this.createHistoryEntry(o));
            }),
            (p.prototype.activatePreviousTab = function () {
              var t = this.getCurrentTab(),
                e = t.parentNode.previousElementSibling;
              if (e) var o = e.querySelector('.govuk-tabs__tab');
              o && (this.hideTab(t), this.showTab(o), o.focus(), this.createHistoryEntry(o));
            }),
            (p.prototype.getPanel = function (t) {
              return this.$module.querySelector(this.getHref(t));
            }),
            (p.prototype.showPanel = function (t) {
              this.getPanel(t).classList.remove(this.jsHiddenClass);
            }),
            (p.prototype.hidePanel = function (t) {
              this.getPanel(t).classList.add(this.jsHiddenClass);
            }),
            (p.prototype.unhighlightTab = function (t) {
              t.setAttribute('aria-selected', 'false'),
                t.parentNode.classList.remove('govuk-tabs__list-item--selected'),
                t.setAttribute('tabindex', '-1');
            }),
            (p.prototype.highlightTab = function (t) {
              t.setAttribute('aria-selected', 'true'),
                t.parentNode.classList.add('govuk-tabs__list-item--selected'),
                t.setAttribute('tabindex', '0');
            }),
            (p.prototype.getCurrentTab = function () {
              return this.$module.querySelector('.govuk-tabs__list-item--selected .govuk-tabs__tab');
            }),
            (p.prototype.getHref = function (t) {
              var e = t.getAttribute('href');
              return e.slice(e.indexOf('#'), e.length);
            }),
            (t.initAll = function (t) {
              var o = void 0 !== (t = void 0 !== t ? t : {}).scope ? t.scope : document;
              e(o.querySelectorAll('[data-module="govuk-button"]'), function (t) {
                new r(t).init();
              }),
                e(o.querySelectorAll('[data-module="govuk-accordion"]'), function (t) {
                  new n(t).init();
                }),
                e(o.querySelectorAll('[data-module="govuk-details"]'), function (t) {
                  new a(t).init();
                }),
                e(o.querySelectorAll('[data-module="govuk-character-count"]'), function (t) {
                  new s(t).init();
                }),
                e(o.querySelectorAll('[data-module="govuk-checkboxes"]'), function (t) {
                  new l(t).init();
                }),
                new u(o.querySelector('[data-module="govuk-error-summary"]')).init(),
                new d(o.querySelector('[data-module="govuk-header"]')).init(),
                e(o.querySelectorAll('[data-module="govuk-notification-banner"]'), function (t) {
                  new c(t).init();
                }),
                e(o.querySelectorAll('[data-module="govuk-radios"]'), function (t) {
                  new h(t).init();
                }),
                e(o.querySelectorAll('[data-module="govuk-tabs"]'), function (t) {
                  new p(t).init();
                });
            }),
            (t.Accordion = n),
            (t.Button = r),
            (t.Details = a),
            (t.CharacterCount = s),
            (t.Checkboxes = l),
            (t.ErrorSummary = u),
            (t.Header = d),
            (t.Radios = h),
            (t.Tabs = p);
        })(e);
      },
    },
    e = {};
  function o(n) {
    var i = e[n];
    if (void 0 !== i) return i.exports;
    var r = (e[n] = { exports: {} });
    return t[n].call(r.exports, r, r.exports, o), r.exports;
  }
  (o.n = t => {
    var e = t && t.__esModule ? () => t.default : () => t;
    return o.d(e, { a: e }), e;
  }),
    (o.d = (t, e) => {
      for (var n in e) o.o(e, n) && !o.o(t, n) && Object.defineProperty(t, n, { enumerable: !0, get: e[n] });
    }),
    (o.g = (function () {
      if ('object' == typeof globalThis) return globalThis;
      try {
        return this || new Function('return this')();
      } catch (t) {
        if ('object' == typeof window) return window;
      }
    })()),
    (o.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (() => {
      'use strict';
      var t = o(4),
        e = o.n(t),
        n = o(465),
        i = o.n(n),
        r = o(152),
        a = o.n(r);
      function s(t) {
        this.$module = t;
      }
      (s.prototype.init = function () {
        let t = this.$module;
        if (!t) return;
        let e = document.createElement('button');
        (e.className = 'app-copy-button js-copy-button'),
          e.setAttribute('aria-live', 'assertive'),
          (e.textContent = 'Copy code'),
          t.insertBefore(e, t.firstChild),
          this.copyAction();
      }),
        (s.prototype.copyAction = function () {
          try {
            new (a())('.js-copy-button', {
              target: function (t) {
                return t.nextElementSibling;
              },
            }).on('success', function (t) {
              (t.trigger.textContent = 'Code copied'),
                t.clearSelection(),
                setTimeout(function () {
                  t.trigger.textContent = 'Copy code';
                }, 5e3);
            });
          } catch (t) {
            t && console.log(t.message);
          }
        });
      const l = s,
        u = function (t) {
          (this.container = t),
            (this.keys = { left: 37, right: 39, up: 38, down: 40 }),
            (this.cssHide = 'app-tabs__panel--hidden'),
            (this.tabs = t.find('.app-tabs__tab')),
            (this.panels = t.find('.app-tabs__panel')),
            this.container.on('click', '[role=tab]', $.proxy(this, 'onTabClick')),
            this.container.on('keydown', '[role=tab]', $.proxy(this, 'onTabKeydown')),
            this.container.on('click', '.app-tabs__close', $.proxy(this, 'onCloseButtonClick')),
            this.setupHtml();
        };
      (u.prototype.hasTab = function (t) {
        return this.container.find(t).length;
      }),
        (u.prototype.hideTab = function (t) {
          this.unhighlightTab(t), this.hidePanel(t);
        }),
        (u.prototype.showTab = function (t) {
          this.highlightTab(t), this.showPanel(t);
        }),
        (u.prototype.getTab = function (t) {
          return this.tabs.filter('a[href="' + t + '"]');
        }),
        (u.prototype.setupHtml = function () {
          this.container.find('.app-tabs__list').attr('role', 'tablist'),
            this.container.find('.app-tabs__list-item').attr('role', 'presentation'),
            this.tabs.attr('role', 'tab'),
            this.panels.attr('role', 'tabpanel'),
            this.tabs.each(
              $.proxy(function (t, e) {
                let o = this.getHref($(e)).slice(1);
                (e.id = 'tab_' + o), $(e).attr('aria-controls', o);
              }, this)
            ),
            this.panels.each(
              $.proxy(function (t, e) {
                $(e).attr('aria-labelledby', this.tabs[t].id);
              }, this)
            ),
            this.panels.addClass(this.cssHide);
        }),
        (u.prototype.onTabClick = function (t) {
          t.preventDefault();
          let e = $(t.target),
            o = this.getCurrentTab();
          o[0] && this.hideTab(o), e[0] !== o[0] && this.showTab(e);
        }),
        (u.prototype.onTabKeydown = function (t) {
          switch (t.keyCode) {
            case this.keys.left:
            case this.keys.up:
              this.activatePreviousTab(), t.preventDefault();
              break;
            case this.keys.right:
            case this.keys.down:
              this.activateNextTab(), t.preventDefault();
          }
        }),
        (u.prototype.activateNextTab = function () {
          let t = this.getCurrentTab(),
            e = t.parent().next().find('[role=tab]');
          e[0] && (this.hideTab(t), this.showTab(e), e.focus(), this.createHistoryEntry(e));
        }),
        (u.prototype.activatePreviousTab = function () {
          let t = this.getCurrentTab(),
            e = t.parent().prev().find('[role=tab]');
          e[0] && (this.hideTab(t), this.showTab(e), e.focus(), this.createHistoryEntry(e));
        }),
        (u.prototype.getPanel = function (t) {
          return $(this.getHref(t));
        }),
        (u.prototype.showPanel = function (t) {
          $(this.getHref(t)).removeClass(this.cssHide);
        }),
        (u.prototype.hidePanel = function (t) {
          $(this.getHref(t)).addClass(this.cssHide);
        }),
        (u.prototype.unhighlightTab = function (t) {
          t.attr('aria-selected', 'false');
        }),
        (u.prototype.highlightTab = function (t) {
          t.attr('aria-selected', 'true');
        }),
        (u.prototype.getCurrentTab = function () {
          return this.container.find('[role=tab][aria-selected=true]');
        }),
        (u.prototype.getHref = function (t) {
          let e = t.attr('href');
          return e.slice(e.indexOf('#'), e.length);
        }),
        (u.prototype.onCloseButtonClick = function (t) {
          let e = this.getCurrentTab();
          this.hideTab(e), this.tabs.first().focus();
        });
      const c = u;
      e().initAll(),
        i().initAll(),
        $(function () {
          $('[data-module="app-tabs"]').each(function (t, e) {
            new c($(e));
          }),
            $('[data-module="app-copy"]').each(function (t, e) {
              new l(e).init();
            });
        }),
        (window.MOJFrontend = i());
    })();
})();
//# sourceMappingURL=all.js.map
