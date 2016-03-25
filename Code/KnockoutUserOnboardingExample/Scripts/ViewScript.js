
$(document).ready(function () {

    // define user details model
    function userModel() {
        this.UserName = ko.observable();
        this.Password = ko.observable();
        this.FirstName = ko.observable();
        this.LastName = ko.observable();
        this.Email = ko.observable();

        this.USR_Required = ko.computed(function () {
            var rslt = (this.UserName() != "")
            return rslt == true ? "NR" : "Required";
        }, this);

        this.PWD_Required = ko.computed(function () {
            var rslt = (this.Password() != "")
            return rslt == true ? "NR" : "Required";
        }, this);

        this.EML_Required = ko.computed(function () {
            var rslt = (this.Email() != "")
            return rslt == true ? "NR" : "Required";
        }, this);

        this.InValidEmail = ko.computed(function () {
            if (this.Email() == "") // dont test if no value present
            {
                return false;
            }
            var rslt = !validateEmail(this.Email());
            return rslt;
        }, this);

        this.ValidCredentials = ko.computed(function () {
            var ValidCreds = (this.UserName() != "" && this.Password() != "" && this.Email() != "");
            return !ValidCreds ? "Red" : "Green";
        }, this);

    };

    // Define ViewModel which is an array of user details model
    var userVM = {
        userModel: ko.observableArray([]),
        removeUser: function (data) {
                RemoveUserFromList(data)
        }
    };

    /* valid email regex nabbed from: http://stackoverflow.com/a/46181/11236  */
    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    // Bind the VM to the UI
    ko.applyBindings(userVM);


    $('#lnkUpload').click(function () {
        var FileToRead = document.getElementById('UserFile');
        if (FileToRead.files.length > 0) {
            var reader = new FileReader();
            // assign function to the OnLoad event of the FileReader
            // non synchronous event
            reader.onload = Load_CSVData;
            // call the reader to capture the file
            reader.readAsText(FileToRead.files.item(0));
        }
    });

    
    function RemoveUserFromList(data) {
        userVM.userModel.remove(data);
    }

    function Load_CSVData(e) {
        userVM.userModel.removeAll();
        CSVLines = e.target.result.split(/\r\n|\n/);
        $.each(CSVLines, function (i, item) {

            var element = item.split(","); // builds an array from comma delimited items
            var LUserName = (element[0] == undefined) ? "" : element[0].trim();
            var LPassword = (element[1] == undefined) ? "" : element[1].trim();
            var LFirstName = (element[2] == undefined) ? "" : element[2].trim();
            var LLastName = (element[3] == undefined) ? "" : element[3].trim();
            var LEmailAddress = (element[4] == undefined) ? "" : element[4].trim();

            userVM.userModel.push(new userModel()
                .UserName(LUserName)
                .Password(LPassword)
                .FirstName(LFirstName)
                .LastName(LLastName)
                .Email(LEmailAddress)

            )
        });
    }


});