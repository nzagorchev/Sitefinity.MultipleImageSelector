Type.registerNamespace("SitefinityWebApp.ImageSelector.MultipleImageSelector");

SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner = function (element) {
    /* Initialize Message fields */
    this._message = null;

    /* Initialize Images Selector fields */
    this._lnkDone = null;
    this._lnkCancel = null;
    this._selectDialog = null;
    this._ItemSelector = null;
    this._SelectedKeys = null;
    this._SelectedItems = null;
    this._BinderBound = false;
    this._doneSelectingDelegate = null;
    this._cancelDelegate = null;
    this._ItemSelectorCloseDelegate = null;
    this._DataBoundDelegate = null;

    this._rowDeselectedDelegate = null;
    this._rowSelectedDelegate = null;
    this._baseNavigateToPage = null;

    this._selectedItemsList = null;
    this._selectButton = null;
    this._itemsFilter = "";
    this._providerName = "OpenAccessDataProvider";
    this._itemsType = "Telerik.Sitefinity.Libraries.Model.Image";
    this._serviceUrl = "/Sitefinity/Services/Content/ImageService.svc/";

    this._selectedItems = kendo.observable({ items: [] });

    this._thumbnailSelect = "img.tmb";

    /* Calls the base constructor */
    SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner.initializeBase(this, [element]);
}

SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner.prototype = {
    /* --------------------------------- set up and tear down --------------------------------- */
    initialize: function () {
        /* Here you can attach to events or do other initialization */
        SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner.callBaseMethod(this, 'initialize');

        if (this._selectButton) {
            this._selectButtonClickDelegate = Function.createDelegate(this, this._selectButtonClicked);
            $addHandler(this._selectButton, "click", this._selectButtonClickDelegate);
        }

        this._binderDataBindingDelegate = Function.createDelegate(this, this._binderDataBindingHandler);
        this._ItemSelector.add_binderDataBinding(this._binderDataBindingDelegate);

        this._removeSelectedItemDelegate = Function.createDelegate(this, this._removeSelectedItem);
        jQuery(this.get_element()).find(this.get_selectedItemsList()).delegate('.remove', 'click', this._removeSelectedItemDelegate);

        if (this._lnkDone) {
            this._DoneSelectingDelegate = Function.createDelegate(this, this._DoneSelecting);
            $addHandler(this._lnkDone, "click", this._DoneSelectingDelegate);
        }

        if (this._lnkCancel) {
            this._CancelDelegate = Function.createDelegate(this, this._ItemSelectorCloseHandler);
            $addHandler(this._lnkCancel, "click", this._CancelDelegate);
        }

        this._selectDialog = jQuery("#ImagesSelector").dialog({
            autoOpen: false,
            modal: false,
            width: 540,
            height: "auto",
            closeOnEscape: true,
            resizable: false,
            draggable: false,
            zIndex: 5000,
        });

        this.get_ItemSelector().bindSelector = this._bindSelector;

        this._DataBoundDelegate = Function.createDelegate(this, this._setTemplate);
        this.get_ItemSelector().add_binderDataBound(this._DataBoundDelegate);

        kendo.bind($(this.get_selectedItemsList()), this._selectedItems);
    },
    dispose: function () {
        /* this is the place to unbind/dispose the event handlers created in the initialize method */
        SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner.callBaseMethod(this, 'dispose');

        this._selectedItems.items.splice(0, this._selectedItems.items.length);

    },

    /* --------------------------------- public methods ---------------------------------- */

    findElement: function (id) {
        var result = jQuery(this.get_element()).find("#" + id).get(0);
        return result;
    },

    /* Called when the designer window gets opened and here is place to "bind" your designer to the control properties */
    refreshUI: function () {
        this.get_ItemSelector().get_binder().set_clearSelectionOnRebind(false);

        this.get_ItemSelector()._originalUrlParams.filter = '';
        this.get_ItemSelector()._showAllItems = this._showAllItems;
        this.get_ItemSelector()._showSelectedItems = this._showSelectedItems;

        var controlData = this._propertyEditor.get_control(); /* JavaScript clone of your control - all the control properties will be properties of the controlData too */

        /* RefreshUI Message */
        jQuery(this.get_message()).val(controlData.Message);

        /* RefreshUI SelectedImagesIds */

        var value = controlData.SelectedImagesIds;
        if (value != null && value != "") {
            var dataItems = JSON.parse(value);
            var filterExpression = "";
            for (var i = 0; i < dataItems.length; i++) {
                if (i > 0) {
                    filterExpression = filterExpression + ' OR ';
                }
                filterExpression = filterExpression + 'Id == ' + dataItems[i].toString();
            }
            var data = {
                "filter": filterExpression,

                "itemType": this._itemsType,

                "provider": this._providerName,
            };

            var self = this;
            $.ajax({
                url: this._serviceUrl,
                type: "GET",
                dataType: "json",
                data: data,
                headers: { "SF_UI_CULTURE": "en" },
                contentType: "application/json; charset=utf-8",
                /*on success add them to the kendo observable array*/
                success: function (result) {
                    self._resizeControlDesigner();
                    self._selectedItems.items.splice(0, self._selectedItems.items.length);
                    for (var i = 0; i < result.Items.length; i++) {
                        self._selectedItems.items.push(result.Items[i]);
                    }
                }
            });
        }

        this._resizeControlDesigner();
    },

    /* Called when the "Save" button is clicked. Here you can transfer the settings from the designer to the control */
    applyChanges: function () {
        var controlData = this._propertyEditor.get_control();
        /* ApplyChanges Message */
        controlData.Message = jQuery(this.get_message()).val();

        var data = new Array();
        var items = this._selectedItems.toJSON();
        /* ApplyChanges Items */
        for (var i = 0; i < items.items.length; i++) {
            data.push(items.items[i].Id);
        }

        controlData.SelectedImagesIds = JSON.stringify(data);
    },

    _setTemplate: function () {
        jQuery.each(jQuery(this._thumbnailSelect), function (i, l) {
            var element = jQuery(l);
            var url = element.attr('src');
            if (!url || url == "#") {
                element.attr('src', element.parent().text());
                element.parent().html(element);
            }
        });
    },

    _resizeControlDesigner: function () {
        setTimeout(function () {
            var element = jQuery(dialogBase.get_designer().get_element());
            if (element) {
                var layoutRoot = element.find("#designerLayoutRoot");
                if (layoutRoot) {
                    var width = layoutRoot[0].scrollWidth;
                    if (width > 0) {
                        width = width + 100 + "px";
                        dialogBase.setWndWidth(width);
                    }
                    var height = layoutRoot[0].scrollHeight;
                    if (height > 0) {
                        height = height + 200 + "px";
                        dialogBase.setWndHeight(height);
                    }
                }
            }
        }, 100);
    },

    _selectButtonClicked: function (sender, args) {
        this.get_myLibrarySelector()._dataBind('albums');
        this.get_myLibrarySelector()._addSelectionChanged(this._librarySelectionChanged);
        this.get_myLibrarySelector()._addAllLibrariesSelected(this._resetSelectors);
        _selfDesigner = this;

        var itemSelector = this.get_ItemSelector();
        if (itemSelector) {
            itemSelector._selectorSearchBox.get_binderSearch()._multilingual = false;
            itemSelector._selectorSearchBox.get_binderSearch()._additionalFilterExpression = ""

            itemSelector.dataBind();
        }

        this._selectDialog.dialog("open");

        jQuery("#designerLayoutRoot").hide();
        this._selectDialog.dialog().parent().css("min-width", "525px");
        dialogBase.resizeToContent();

        _imageSelectorControl = this;

        return false;
    },

    _librarySelectionChanged: function (sender, args) {
        if (args && args[0] && args[0].Id) {
            _selfDesigner.get_ItemSelector()._binder._serviceBaseUrl = _selfDesigner._serviceUrl + "parent/" + args[0].Id + "/";
            _selfDesigner.get_ItemSelector().dataBind();
        }
        else {
            _selfDesigner._resetSelectors();
        }
    },

    _resetSelectors: function () {
        _selfDesigner.get_ItemSelector().get_binder()._serviceBaseUrl = _selfDesigner._serviceUrl;
        _selfDesigner.get_myLibrarySelector()._clearSelection();
        _selfDesigner.get_ItemSelector().dataBind();
    },

    _removeSelectedItem: function (value) {
        var itemToRemove = $(value.target).siblings().first();
        var data = this._selectedItems.toJSON();
        /*find the index of the selected item and delete it*/
        for (var i = 0; i < data.items.length; i++) {
            if (data.items[i].Id == itemToRemove.data("id")) {
                this._selectedItems.items.splice(i, 1);
                break;
            }
        }
    },
	
    _showAllItems: function () {
        this._binder.set_serviceBaseUrl(this._binder._serviceBaseUrl);
        this._binder.set_urlParams(this._originalUrlParams);
        if (this._binder.get_target().style) {
            this._binder.get_target().style.display = '';
        }
        this._binder.set_filterExpression('');
        this._binder.DataBind();
    },
	
    _showSelectedItems: function () {
        var needsUrlArgs = this._needsSelectedSeviceUrlHandler();
        if (needsUrlArgs == null) {
            var dataKeyName = this._dataKeyNames[0];
            var filter = '';
            //ensure correct count
            this._selectedItemsCount = this._selectedItems.length;

            for (var x = 0; x < this._selectedItemsCount; x++) {
                filter += dataKeyName + ' = "' + this._selectedKeys[x] + '" OR ';
            }
            filter = filter.substring(0, filter.length - 4);
            if (this._selectedItemsCount > 0) {
                this._binder.set_filterExpression(filter);
                this._binder.DataBind();
            } else {
                // fix style issue
                if (this._binder.get_target().style) {
                    this._binder.get_target().style.display = 'none';
                }
            }
        }
        else {
            this._callServiceWithNeedsServiceUrlEventArgs(needsUrlArgs, this._selectedItemsReceivedDelegate);
        }
    },

    _bindSelector: function () {
        var urlParams = this._binder.get_urlParams();
        urlParams['itemType'] = this._itemType;
        if (this._itemSurrogateType != null)
            urlParams['itemSurrogateType'] = this._itemSurrogateType;
        urlParams['allProviders'] = (this._providerName == "" || this._providerName == null);
        if (this.get_combinedFilter())
            urlParams['filter'] = this.get_combinedFilter();
        urlParams.filter = "";
        this._binder.set_provider(this._providerName);
        this._binder.DataBind();
    },

    _binderDataBindingHandler: function (sender, args) {
        var selectedItems = this._selectedItems.items.toJSON();

        var itemSelector = this.get_ItemSelector();

        if (selectedItems) {
            var items = args.get_dataItem().Items;
            for (var i = 0; i < selectedItems.length; i++) {
                var selectedItem = selectedItems[i];
                itemSelector.selectItem(selectedItem.Id, selectedItem);
            }
        }
    },

    _ItemSelectorCloseHandler: function (sender, args) {
        this._selectDialog.dialog("close");
        jQuery("#designerLayoutRoot").show();
        dialogBase.resizeToContent();

        this._resetSelectors();
    },

    _DoneSelecting: function (sender, args) {
        this._selectedItems.items.splice(0, this._selectedItems.items.length);

        var selectedItems = this.get_SelectedItems();
        if (selectedItems != null && selectedItems.length > 0) {
            var data = selectedItems;
            for (var i = 0; i < data.length; i++) {
                this._selectedItems.items.push(data[i]);
            }
        }
        this._selectDialog.dialog("close");
        jQuery("#designerLayoutRoot").show();
        dialogBase.resizeToContent();
    },

    /* --------------------------------- properties -------------------------------------- */

    /* Message properties */
    get_message: function () { return this._message; },
    set_message: function (value) { this._message = value; },

	/* ImagesSelector properties */
    get_selectedItemsList: function () {
        return this._selectedItemsList;
    },
    set_selectedItemsList: function (value) {
        this._selectedItemsList = value;
    },

    get_selectButton: function () {
        return this._selectButton;
    },
    set_selectButton: function (value) {
        this._selectButton = value;
    },

    get_ItemSelector: function () {
        return this._ItemSelector;
    },
    set_ItemSelector: function (value) {
        this._ItemSelector = value;
    },

    get_Binder: function () {
        return this._ItemSelector.get_binder();
    },

    get_SelectedKeys: function () {
        return this._ItemSelector.get_selectedKeys();
    },
    set_SelectedKeys: function (keys) {
        this._selectedKeys = keys;
    },

    get_SelectedItems: function () {
        return this._ItemSelector.getSelectedItems();
    },
    set_SelectedItems: function (items) {
        this._SelectedItems = items;
        if (this._BinderBound) {
            this._ItemSelector.bindSelector();
        }
    },

    get_lnkDone: function () {
        return this._lnkDone;
    },
    set_lnkDone: function (value) {
        this._lnkDone = value;
    },
    get_lnkCancel: function () {
        return this._lnkCancel;
    },
    set_lnkCancel: function (value) {
        this._lnkCancel = value;
    },
    get_myLibrarySelector: function () {
        return this._myLibrarySelector;
    },
    set_myLibrarySelector: function (value) {
        this._myLibrarySelector = value;
    }
}

SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner
.registerClass('SitefinityWebApp.ImageSelector.MultipleImageSelector.MultipleImageSelectorDesigner',
    Telerik.Sitefinity.Web.UI.ControlDesign.ControlDesignerBase);
