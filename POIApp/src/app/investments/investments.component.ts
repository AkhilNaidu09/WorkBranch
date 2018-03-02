import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { InvestmentService } from '../services/investment.service';
import { IFieldTemplate } from '../IFieldTemplate';
import { MonthNames } from '../Months';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtauthenticationService } from '../services/jwtauthentication.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.css'],
  providers: [JwtauthenticationService]
})
export class InvestmentsComponent implements OnInit {
  debugger;
  id: string = "";
  userName: string = "";
  MobileNumber: string;
  configValues: any;
  date: any = Date.now();
  Fields_80C: IFieldTemplate[];
  Fields_Others: IFieldTemplate[];
  guideLines: Array<string>;
  showUploadbtn: any = [];
  othersshowUploadbtn: any = [];
  showRentUploadbtn: any = false;
  showPanUploadbtn: any = false;
  showAggrementUploadbtn: any = false;
  fieldsData: any = [];
  filesToUpload: Array<File> = [];
  hasError: any = [];
  hasSizeError: any = [];
  hasOthersError: any = [];
  hasOthersSizeError: any = [];
  errorMessage: string;
  formHasError: boolean = false;
  months: any = [];
  rentAmount: number = 0;
  RntRctFile: String = "";
  PanFile: String = "";
  RntAggFile: String = "";
  emailID: String;
  medRctFile: String = "";
  showMedicalUploadbtn: boolean = false;
  medAmount: number = 0;
  loading: boolean = true;
  hasPanError: boolean = false;
  hasrentError: boolean = false;
  hasAggError: boolean = false;
  hasMedError: boolean = false;
  errorPanMessage: string = "Please upload Pan Card copy";
  errorRentMessage: string = "Please upload rent receipt";
  errorAggMessage: string = "Please upload rent aggrement"
  errorMedMessage: string = "Please upload Medical documents";
  SubmitStatus: string = "Processing";
  appError: boolean = false;
  errorMesage: string = "";
  errorMessage_Others:any=[];
  errorMessage_80C:any=[];
  constructor(private investmentService: InvestmentService, private jwtauthenticationService: JwtauthenticationService, private datePipe: DatePipe, private route: ActivatedRoute) {
    this.date = this.datePipe.transform(new Date()).toString();
    this.userName=sessionStorage.getItem("Username");
    this.id=sessionStorage.getItem("VamID");
  }

  ngOnInit() {
    debugger;
    if (sessionStorage.getItem("IsValidSession") == "true") {
      this.loading = true;
      this.GetJsonData();
      this.GetGuideLines();
      this.GetConfigurationData();
      this.months = MonthNames;
      this.UpdateMonths();
      this.GetMobileEmail();
      this.GetMedicalDetails();
    }
    else {
      this.loading = false;
    }

  }
  GetMedicalDetails()
  {
    this.investmentService.GetMedicalDetails(+this.id).subscribe(response => {
      response=JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
      if (response != "") {
        
        }
    },
      err => {
        this.appError = true;
      });
    this.loading = false;
  }

  UpdateMonths() {
    this.investmentService.GetMonthlyHra().subscribe(response => {
      response=JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
      if (response != "[]" && response != "") {
        var updatedMonthDetails = JSON.parse(response)[0];
        Object.entries(updatedMonthDetails).forEach(element => {
          if (element[0] == "RentReciptFile") {
            this.RntRctFile = element[1];
            this.showRentUploadbtn = false;
          }
          else if (element[0] == "PanFile") {
            this.PanFile = element[1];
            this.showPanUploadbtn = false;
          }
          else if (element[0] == "AggrementFile") {
            this.RntAggFile = element[1];
            this.showAggrementUploadbtn = false;
          }
          else if (element[0] == "Total_Rent") {
            this.rentAmount = element[1];
          }
          else {
            this.months.forEach(subelement => {
              if (subelement.Name == element[0]) {
                subelement.Amount = element[1];
              }

            });
          }
        });
      }
      else {
        this.months = MonthNames;
      }
    },
      err => {
        this.appError = true;

      }
    );
  }
  GetJsonData() {
    this.investmentService.GetJsonData().subscribe(response => {
      response=JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
      this.Fields_80C = response["80C"];
      this.Fields_Others = response["Others"];
    },
      err => {
        this.appError = true;
      }
    );
  }

  GetConfigurationData() {
    this.investmentService.GetConfigData().subscribe(response => {
      this.configValues = JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
    },
      err => {
        this.appError = true;
      }
    );
  }

  GetGuideLines() {
    this.investmentService.GetGuidelines().subscribe(response => {
      this.guideLines = JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
    },
      err => {
        this.appError = true;
      }
    );
  }

  GetMobileEmail() {
    this.investmentService.GetMobileEmailDetails(+this.id).subscribe(response => {
      response=JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
      if (response != "") {
        this.MobileNumber = JSON.stringify(response).split(',')[0].split(':')[1];
        this.emailID = JSON.stringify(response).split(',')[1].split(':')[1];
        if (this.emailID.endsWith('"')) {
          this.emailID = this.emailID.replace("\"", "");
        }
      }
    },
      err => {
        this.appError = true;
      });
  }

  AmountChanged(event, row, index) {
    if (event.target.value == 0 || event.target.value == "") {
      this.showUploadbtn[index] = false;
      this.hasSizeError[index] = false;
      this.hasError[index] = false;
      row.Amount = "";
      row.FileInfo = "";
      let file: number = this.filesToUpload.findIndex(item => item.name == row.FileName);
      row.FileName = "";
      this.filesToUpload.splice(file, 1);
    }
    else {
      this.showUploadbtn[index] = true;
    }
  }
  OthersAmountChanged(event, row, index) {
    if (event.target.value == 0 || event.target.value == "") {
      this.othersshowUploadbtn[index] = false;
      this.hasOthersSizeError[index] = false;
      this.hasOthersError[index] = false;
      row.Amount = "";
      row.FileInfo = "";
      let file: number = this.filesToUpload.findIndex(item => item.name == row.FileName);
      row.FileName = "";

    }
    else {
      this.othersshowUploadbtn[index] = true;
    }
  }
  fileChange(event, row: IFieldTemplate, index, target) {
    this.formHasError = false;
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];
    //if file already exists remove that file from filesToUpload array
    if (row.FileName != "") {
      let file: number = this.filesToUpload.findIndex(item => item.name == row.FileName);
      this.filesToUpload.splice(file, 1);
    }
    row.FileName = file.name;
    row.FileInfo = file;
    //Check file format
    debugger;
    if (+row.Amount > 0 && !(row.FileName.endsWith(".pdf") || row.FileName.endsWith(".zip") || row.FileName.endsWith(".jpeg") || row.FileName.endsWith(".jpg") || row.FileName.endsWith(".png") || row.FileName.endsWith(".rar"))) {
      if (target == "first") {
        this.hasError[index] = true;
        this.errorMessage_80C[index] = "File should be only in formats mentioned in guidelines";
      }
      else if (target == "others") {
        this.hasOthersError[index] = true;
        this.errorMessage_Others[index] = "File should be only in formats mentioned in guidelines";
      }
      this.formHasError = true;
    }
    //check for file size
    else if ((file.name.endsWith('.zip') || file.name.endsWith('.rar')) && file.size >= 5000000) {
      if (target == "first") {
        this.hasSizeError[index] = true;
        this.errorMessage_80C[index] = "File size should not exceed 5MB";
      }
      else if (target == "others") {
        this.hasOthersSizeError[index] = true;
        this.errorMessage_Others[index] = "File size should not exceed 5MB";
      }
    
      this.formHasError = true;
    }
    else if (!(file.name.endsWith('.zip') || file.name.endsWith('.rar')) && file.size >= 600000) {
      if (target == "first") {
        this.hasSizeError[index] = true;
        this.errorMessage_80C[index] = "File size should not exceed 600KB";
      }
      else if (target == "others") {
        this.hasOthersSizeError[index] = true;
        this.errorMessage_Others[index] = "File size should not exceed 600KB";
      }
      this.formHasError = true;
    }
    else {
      if (target == "first") {
        this.hasSizeError[index] = false;
        this.hasError[index]=false;
      }
      else if (target == "others") {
        this.hasOthersSizeError[index] = false;
        this.hasOthersError[index]=false;
      }
      this.filesToUpload.push(file);
    }
  }

  isFormEmpty(): boolean {
    let isEmpty: boolean = true;
    this.Fields_80C.forEach(element => {
      if (+element.Amount > 0) {
        isEmpty = false;
      }
    });
    this.Fields_Others.forEach(element => {
      if (+element.Amount > 0) {
        isEmpty = false;
      }
    });
    return isEmpty;
  }

  SumRent(event) {
    this.rentAmount = 0;
    if (event.target.value == "") {
      event.target.value = 0;
      let file: number = this.filesToUpload.findIndex(item => item.name == this.RntRctFile);
      if (file != null) {
        this.filesToUpload.splice(file, 1);
      }
      let panfile: number = this.filesToUpload.findIndex(item => item.name == this.PanFile);
      if (file != null) {
        this.filesToUpload.splice(panfile, 1);
      }
      let aggfile: number = this.filesToUpload.findIndex(item => item.name == this.RntAggFile);
      if (file != null) {
        this.filesToUpload.splice(aggfile, 1);
      }
    }
    this.months.forEach(element => {
      if (element.Amount == null) {
        element.Amount = 0;
      }
      this.rentAmount = +(this.rentAmount + parseInt(element.Amount));
    });

    if (this.rentAmount > 0) {
      this.showRentUploadbtn = true;
    }
    else {
      this.RntRctFile = "";
      this.showRentUploadbtn = false;
    }

    if (this.rentAmount > 100000) {
      this.showPanUploadbtn = true;
    }
    else {
      this.PanFile = "";
      this.showPanUploadbtn = false;
    }
    if (this.rentAmount > 180000) {
      this.showAggrementUploadbtn = true;
    }
    else {
      this.RntAggFile = "";
      this.showAggrementUploadbtn = false;
    }

  }

  fileUpload(event, hracopy) {
    this.formHasError = false;
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];
    if (hracopy == "pan") {
      this.PanFile = event.target.files[0].name;
      this.hasPanError = this.CheckFileFormat(event.target.files[0].name)
      if (this.hasPanError) {
        this.formHasError = true;
        this.errorPanMessage = "File should be only in formats mentioned in guidelines";
      }
      else {
        this.hasPanError = this.CheckFileSize(event)
        if (this.hasPanError) {
          this.formHasError = true;
          this.errorPanMessage = "File should be within the size mentioned in guidelines";
        }
      }
    }
    else if (hracopy == "rent") {
      this.RntRctFile = event.target.files[0].name;
      this.hasrentError = this.CheckFileFormat(event.target.files[0].name)
      if (this.hasrentError) {
        this.errorRentMessage = "File should be only in formats mentioned in guidelines";
        this.formHasError = true;
      }
      else {
        this.hasrentError = this.CheckFileSize(event)
        if (this.hasrentError) {
          this.errorRentMessage = "File should be within the size mentioned in guidelines";
          this.formHasError = true;
        }
      }
    }
    else if (hracopy == "aggrement") {
      this.RntAggFile = event.target.files[0].name;
      this.hasAggError = this.CheckFileFormat(event.target.files[0].name)
      if (this.hasAggError) {
        this.errorRentMessage = "File should be only in formats mentioned in guidelines";
        this.formHasError = true;
      }
      else {
        this.hasAggError = this.CheckFileSize(event)
        if (this.hasAggError) {
          this.errorRentMessage = "File should be within the size mentioned in guidelines";
          this.formHasError = true;
        }
      }
    }
    else if (hracopy == "medical") {
      this.medRctFile = event.target.files[0].name;
      this.hasMedError = this.CheckFileFormat(event.target.files[0].name)
      if (this.hasMedError) {
        this.errorMedMessage = "File should be only in formats mentioned in guidelines";
        this.formHasError = true;
      }
      else {
        this.hasMedError = this.CheckFileSize(event)
        if (this.hasMedError) {
          this.errorMedMessage = "File should be within the size mentioned in guidelines";
          this.formHasError = true;
        }
      }
    }
    this.filesToUpload.push(file);
  }
  CheckFileFormat(fileName): boolean {
    return !(fileName.endsWith(".pdf") || fileName.endsWith(".rar") || fileName.endsWith(".zip") || fileName.endsWith(".jpeg") || fileName.endsWith(".jpg") || fileName.endsWith(".png")) ? true : false;
  }
  CheckFileSize(event): boolean {
    let fileList: FileList = event.target.files;
    let file: File = fileList[0];
    if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) {
      return file.size >= 5000000 ? true : false;
    }
    else {
      return file.size >= 600000 ? true : false;
    }
  }
  MedicalAmountChange(event) {
    if (event.target.value > 0) {
      this.showMedicalUploadbtn = true;
      this.medAmount = event.target.value;
    }
    else if (event.target.value == 0 || event.target.value == "") {
      this.medAmount=0;
      this.medRctFile = "";
      this.showMedicalUploadbtn = false;
    }

    if(event.target.value>0&& this.medRctFile=="")
    {
      this.formHasError=true;
    }
  }

  SubmitClick(status) {
    this.loading = true;
    this.fieldsData.push(this.Fields_80C);
    this.fieldsData.push(this.Fields_Others);
    let formData: FormData = new FormData();
    formData.append('Data', JSON.stringify(this.fieldsData));
    formData.append('VamID', sessionStorage.getItem("VamID"));
    formData.append('EmployeeName', sessionStorage.getItem("Username"));
    formData.append('SubmissionDate', this.date.toString());
    formData.append('MobileNumber', this.MobileNumber.toString());
    formData.append('RentAmount', this.rentAmount.toString());
    formData.append('PanFile', this.PanFile != "" ? this.PanFile.toString() : "");
    formData.append('RentReciptFile', this.RntRctFile.toString());
    formData.append('AggrementFile', this.RntAggFile != "" ? this.RntAggFile.toString() : "");
    formData.append('Email', this.emailID.toString());
    formData.append('Medical_Amount', this.medAmount.toString());
    formData.append('Medical_File', this.medRctFile != "" ? this.medRctFile.toString() : "");
    formData.append('HraAmount', JSON.stringify(this.months));
    formData.append('Status', status);
    for (var j = 0; j < this.filesToUpload.length; j++) {
      formData.append("file[]", this.filesToUpload[j], this.filesToUpload[j].name);
    }
    this.investmentService.UploadData(formData).subscribe(response => {
      debugger;
      response=JSON.parse(this.jwtauthenticationService.decode(response).PayloadData);
      if (response == "Uploaded Sucessfully") {
        this.SubmitStatus = "Data Submitted Successfully";
      }
    },
      err => {
        this.appError = true;
      });
    this.loading = false;
  }

  ResetAll() {
    for (var i = 0; i <= this.Fields_80C.length; i++) {
      this.showUploadbtn[i] = false;
      this.hasSizeError[i] = false;
    }
    this.rentAmount=0;
    // this.showUploadbtn=false;
  }

}
