﻿
MyAgDataMobile.fieldList = (function () {

    //ViewModel to be bound to the view
    var viewModel = kendo.observable({
        fieldList: {},
        selectedGrower: {
            growerId: "",
            growerName: "",
            cropYear: ""
        },
        selectedDate: ""
    });

    function getFieldList(groupBy) {
   //    alert("Get the List of Field for GrowerId = " + viewModel.selectedGrower.growerId);
        var serviceOptions = {
            url: MyAgDataMobile.configuration.getFieldListUrl,
//            data: { id: 16, growerId: 2036, cropYear: 2013, seasonNumber: 44, farmOpNumber: 22, groupBy: groupBy},    //id=16&growerId=2036&cropYear=2013&seasonNumber=44&farmOpNumber=22
            data: {
                userId: 16,
                growerId: viewModel.selectedGrower.growerId,
                cropYear: 2013,
                seasonValueId: 21,
                farmOperationValueId: 22,
                GroupByItem: groupBy
            },    
            requestType: "GET",
            dataType: "JSON",
       //     group: "cropName",
        //    callBack: callBack //,
            //  group: { field: "letter" }
            callBack: function (result) {
                if (result.success === true) {
                      viewModel.set("fieldList", result.data);
                      $("#partfield-list").kendoMobileListView({
                          dataSource: kendo.data.DataSource.create({ data: viewModel.fieldList, group: "GroupBy" }),
                          //  template: "${Script1Template}",
                          template: kendo.template($("#fieldlist_template").html()) //,
                       // fixedHeaders: true
                    });

                } else {
                    //any error handling code
                }
            }
        };
        MyAgDataMobile.dataAccess.callService(serviceOptions);
    }

    function callBack(result) {
        if (result.success === true) {
            viewModel.set("fieldList", result.data);
        }
    }    

    //handler for show event of the view
    function show(e) {
   //    alert('made it to the show list');

        //hard coding today's date for selected date
        viewModel.set('selectedDate', new Date().toLocaleDateString());
        //read the selected movie's details from the query string
        viewModel.set("selectedGrower", {
            growerId: e.view.params.GrowerId,
            growerName: e.view.params.BusinessName,
            cropYear: e.view.params.CropYear
        }); 
        getFieldList("FieldName");
    }

    //retrieve list of theaters from the service
    function showGrowerList() {
        MyAgDataMobile.common.navigateToView('#Growerlist-view');
    }

    function mobileListViewDataBindInitGrouped(e) {
        if (e.sender.selectedIndex == 1)
            getFieldList("County");
        else if (e.sender.selectedIndex == 2)
            getFieldList("State");
        else if (e.sender.selectedIndex == 3)
            getFieldList("CropName");
        else 
            getFieldList("FieldName");
    }

    function initializeApp2() {

        application = new kendo.mobile.Application(document.body,
            {
                //   transition: 'slide',
                loading: "<h3>Loading...</h3>",
                skin: 'ios'
               // skin: "flat"
            });

        ////initialize app
        //application = new kendo.mobile.Application(document.body,
        // {
        //     //   transition: 'slide',
        //     loading: "<h3>Loading...</h3>"
        // });

        //Display loading image on every ajax call
        $(document).ajaxStart(function () {

            //application.showLoading calls the showLoading() method of the 
            //pane object inside the application. During the application's 
            //initial view's init method this pane object may not be initialized
            //and so application.showLoading() may throw error.To prevent this
            //we need to do a check for existence application.pane before calling
            //application.showLoading();
            if (application.pane) {
                application.showLoading();
            }
        });

        //Hide ajax loading image on after ajax call
        $(document).ajaxStop(function () {
            if (application.pane) {
                application.hideLoading();
            }
        });
    }

    return {
        show: show,
        initializeApp2: initializeApp2,
        showGrowerList: showGrowerList,
        getFieldList: getFieldList,
        viewModel: viewModel,
        mobileListViewDataBindInitGrouped: mobileListViewDataBindInitGrouped
    }
})();