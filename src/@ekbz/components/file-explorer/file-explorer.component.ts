import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { FileExplorerService } from 'src/app/models-services/file-explorer/file-explorer.service';
import { IFileTree } from 'src/app/models-services/file-explorer/fileExplorer/file-tree.models';
import { File } from 'src/app/models-services/file-explorer/fileExplorer/file.models';


@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],
})
export class FileExplorerComponent implements OnInit {
  @Output() selectedPathFile = new EventEmitter<string>();
  currentFileTree: IFileTree;
  currentFolder = '';
  copyFile = null;
  currentSelectedFile:number;
  @ViewChild('filepicker') uploader: ElementRef;
 
  constructor(private route: ActivatedRoute, private alertCtrl: AlertController, private router: Router,
     private toastCtrl: ToastController, 
     private loadingCtrl: LoadingController, 
     private fileExplorerService: FileExplorerService) { }
 
  ngOnInit() {
    this.currentFolder = this.route.snapshot.paramMap.get('dir') || '';
    this.loadDocuments(this.currentFolder);
  }
 
  async loadDocuments(dir: string) {
    this.fileExplorerService.getFileTree(dir).subscribe({
      next: (res: HttpResponse<IFileTree>) => {
        this.currentFileTree = res.body;
        if(this.currentFolder == ''){
          this.currentFolder = this.currentFileTree.currentDirectory.path;
        }
        console.log('currentFileTree : ', this.currentFileTree);
      },
      error: () => {
      },
    });
  }
 
  async createFolder() {
    let alert = await this.alertCtrl.create({
      header: 'Création d\'un répertoire',
      message: 'Veuillez spécifier le nom du nouveau répertoire',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Mon répertoire'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Create',
          handler: async data => {
            this.addDirectory(`${this.currentFolder}/${data.name}`);
           //await Filesystem.mkdir({
           //   directory: APP_DIRECTORY,
            //  path: `${this.currentFolder}/${data.name}`
            //});
            this.loadDocuments(this.currentFolder);
          }
        }
      ]
    });
 
    await alert.present();
  }

  addFile() {
    this.uploader.nativeElement.click();
  }
 
  async fileSelected($event) {
    const selected = $event.target.files[0];
    const formData = new FormData();
    formData.append('file', selected, selected.name); 
    formData.append('path', this.currentFolder);
    this.uploadData(formData);
  }

  async addDirectory(path: string) {
    const loading = await this.loadingCtrl.create({
        message: 'Création du répertoire en cours...',
    });
    await loading.present();
 
    this.fileExplorerService.createDirectory(path)
        .pipe(
            finalize(() => {
                loading.dismiss();
            })
        )
        .subscribe(res => {
            if (res.status==201) {
                this.presentToast('Le repertoire a été correctement créé.');
                this.loadDocuments(this.currentFolder);
            } else {
                this.presentToast('La création du répertoire est en erreur.')
            }
        });
}


  // Upload the formData to our API
  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
        message: 'Upload en cours...',
    });
    await loading.present();
 
    this.fileExplorerService.uploadFile(formData)
        .pipe(
          catchError(this.handleError)
        )
        .pipe(
            finalize(() => {
                loading.dismiss();
            })
        )
        .subscribe(res => {
            if (res.status==201) {
                this.presentToast('Le fichier a été correctement uploadé.');
                this.loadDocuments(this.currentFolder);
            } else {
                this.presentToast('L\'upload du fichier est en erreur.')
            }
        },
        (error) => {
          this.presentToastwhithDuration('Erreur lors de l\'upload du fichier :'+ error.error.detail,20000);
            console.log(error.error);
        });
}

handleError(error: HttpErrorResponse) {
  return throwError(error);
}

  // Little helper
  async presentToast(text) {
    this.presentToastwhithDuration(text, 3000);
  }
  
  async presentToastwhithDuration(text, duration: number) {
    const toast = await this.toastCtrl.create({
      message: text,
      duration: duration,
    });
    toast.present();
  }

  async itemClicked(entry: File, index) {
    console.log('entry', entry);
    if (this.copyFile) {
      // TODO
    } else {
      if (!entry.isDirectory) {
        this.currentSelectedFile = index;
        this.selectedPathFile.emit(entry.path);
      } else {
          this.currentSelectedFile = undefined;
          this.selectedPathFile.emit(undefined);
          this.currentFolder = this.currentFolder + '/' + entry.name;
          console.log('load folder : ', this.currentFolder)
          this.loadDocuments(this.currentFolder);
      }
    }
  }

  itemClickedReturn() {
    this.currentSelectedFile = undefined;
    this.selectedPathFile.emit(undefined);
    this.currentFolder = this.currentFolder.substring(0, this.currentFolder.lastIndexOf('/'));
    console.log('load folder : ', this.currentFolder)
    this.loadDocuments(this.currentFolder);
  }

  shortcutLinkForder(linkFolder: string, firstStringToShortcut: string){
    return '/' + linkFolder.substring(linkFolder.indexOf(firstStringToShortcut));
  }

  async delete(f) {
    const loading = await this.loadingCtrl.create({
      message: 'Suppression du fichier...',
  });
  await loading.present();

  this.fileExplorerService.deleteFile(f)
      .pipe(
          finalize(() => {
              loading.dismiss();
          })
      )
      .subscribe(res => {
          if (res.status==200) {
              this.presentToast('Le fichier est bien supprimé.');
              this.loadDocuments(this.currentFolder);
          } else {
              this.presentToast('Erreur lors de la suppression du fichier.')
          }
      });
  }

  startCopy(f) {
    
  }

}
