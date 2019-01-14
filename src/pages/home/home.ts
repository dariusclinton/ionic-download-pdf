import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
              private document: DocumentViewer, 
              private file: File, 
              private transfer: FileTransfer, 
              private platform: Platform, 
              private androidPermissions: AndroidPermissions,
              private fileOpener: FileOpener) {

  }

  downloadPdf() {

    this._getPermission();
  } 

  _download() {
     
    let path = null;

    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else {
      path = this.file.externalRootDirectory + '/Microdic/Download/';
    }

    const transfer = this.transfer.create();
    console.log(path + 'myfile2.pdf');
    transfer.download('https://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf', path + 'myfile2.pdf').then(entry => {
      let url = entry.toURL();
      this.fileOpener.open(url, 'application/pdf')
        .then(() => console.log('File is opened'))
        .catch((e) => console.log('Error opening file', e));
    });
  }

  _getPermission() {
    this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this._download();
        } 
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if(status.hasPermission) {
                this._download();
              }
            });
        }
      });
  }

}
