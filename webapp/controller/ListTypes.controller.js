sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("mrocaj.applists.controller.ListTypes", {
            onInit: function () {

                //se crea objeto JSON
                let oJSONModel = new JSONModel();
                //se carga archivo JSON
                oJSONModel.loadData("../localService/mockdata/ListData.json");
                //se setea el modelo en la vista
                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function (oGRoup) {
                let groupHeaderListItem = new sap.m.GroupHeaderListItem({
                    title : oGRoup.key,
                    upperCase : true
                });
                return groupHeaderListItem;
            },

            onShowSelectedRows: function () {
                let standardList = this.getView().byId("standardList");
                let selectedItems = standardList.getSelectedItems();

                let i18nModel = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0) {
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                } else {

                    let textMessage = i18nModel.getText("selection");

                    for (let item in selectedItems) {
                        let context =  selectedItems[item].getBindingContext() ;
                        let oContext = context.getObject();
                        textMessage = textMessage + " - " + oContext.Material;

                        sap.m.MessageToast.show(textMessage);
                    }
                }

            },

            onDeleteSelectedRows: function () {
                let standardList = this.getView().byId("standardList");
                let selectedItems = standardList.getSelectedItems();

                let i18nModel = this.getView().getModel("i18n").getResourceBundle();

                if (selectedItems.length === 0) {
                    sap.m.MessageToast.show(i18nModel.getText("noSelection"));
                } else {

                    let textMessage = i18nModel.getText("selection");
                    let model = this.getView().getModel();
                    let products = model.getProperty("/Products");

                    let arrayId = [];

                    for (let i in selectedItems) {
                        let context =  selectedItems[i].getBindingContext() ;
                        let oContext = context.getObject();

                        arrayId.push(oContext.Id);
                        textMessage = textMessage + " - " + oContext.Material;
                    }

                    products = products.filter(function(p) {
                        return !arrayId.includes(p.Id);
                    });

                    model.setProperty("/Products", products);
                    standardList.removeSelections();
                    sap.m.MessageToast.show(textMessage);
                }                
            },

            onDeleteRow: function (oEvent) {
                let selectedRow = oEvent.getParameter("listItem");
                let context = selectedRow.getBindingContext();
                let splithPath = context.getPath().split("/");
                let indexSelectedRow = splithPath[splithPath.length-1];
                let model = this.getView().getModel();
                let products = model.getProperty("/Products");
                products.splice(indexSelectedRow,1);
                model.refresh();
            }
        });
    });
