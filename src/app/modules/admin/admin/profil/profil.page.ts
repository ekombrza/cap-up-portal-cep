import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import dayjs from 'dayjs';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { Membre } from 'src/app/models-services/membre/membre.model';
import { MembreService } from 'src/app/models-services/membre/membre.service';
import { Role } from 'src/app/models-services/role/role.model';
import { RoleService } from 'src/app/models-services/role/role.service';
import { AdminUserService } from 'src/app/models-services/user/admin-user.service';
import { User } from 'src/app/models-services/user/user.model';
import { MembresService } from '../../apps/contacts/contacts/membres.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal;
  connectedMembre: Membre;
  adminUser: User;
  roles:Role[];
  modalPresentingElement = null;

  croppedImage: string = 'https://statique.cepevry.fr/contacts.cepevry.fr/DATA/AVATAR/no-avatar.png';
  imageChangedEvent: any = '';
  croppedImageFile:Blob;

  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  constructor(
    private membreService: MembreService,
    private adminUserService: AdminUserService,
    private roleService: RoleService,
    private router: Router
    ) { }

  ngOnInit() {
    this.modalPresentingElement = document.querySelector('.header');
    this.membreService.queryCurrentUser().subscribe(data => {
      this.connectedMembre = data.body;
      this.connectedMembre.creationDate = this.connectedMembre.creationDate ? dayjs(this.connectedMembre.creationDate) : undefined;
      this.connectedMembre.updatedDate = this.connectedMembre.updatedDate ? dayjs(this.connectedMembre.updatedDate) : undefined;
      //if(this.connectedMembre.imageBlob && this.connectedMembre.imageBlob!=''){
      //  this.croppedImage = 'data:'+this.connectedMembre.imageBlobContentType + ';base64,' + this.connectedMembre.imageBlob;
      //}
      if(this.connectedMembre.avatarImageLink){
        this.croppedImage = this.connectedMembre.avatarImageLink;
      }
     
      console.log(this.connectedMembre);

      this.roleService.query({
        'applicationId.equals':'1',
        'membresId.equals':this.connectedMembre.id
      }).subscribe(data => {
        this.roles = data.body;
        console.log(this.roles);
      });

      this.adminUserService.query().subscribe(data => {
        this.adminUser = data.body;
        console.log(this.adminUser);
      });

    });
  }

  navigateToChurch(){
    this.router.navigateByUrl('/admin/church');
  }



    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
       // this.croppedImage = event.base64;
       this.croppedImageFile = base64ToFile(event.base64)
        console.log(event, base64ToFile(event.base64));
    }

    imageLoaded() {
        this.showCropper = true;
        console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
        console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
        console.log('Load failed');
    }

    rotateLeft() {
        this.canvasRotation--;
        this.flipAfterRotate();
    }

    rotateRight() {
        this.canvasRotation++;
        this.flipAfterRotate();
    }

    private flipAfterRotate() {
        const flippedH = this.transform.flipH;
        const flippedV = this.transform.flipV;
        this.transform = {
            ...this.transform,
            flipH: flippedV,
            flipV: flippedH
        };
    }


    flipHorizontal() {
        this.transform = {
            ...this.transform,
            flipH: !this.transform.flipH
        };
    }

    flipVertical() {
        this.transform = {
            ...this.transform,
            flipV: !this.transform.flipV
        };
    }

    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    toggleContainWithinAspectRatio() {
        this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
        this.transform = {
            ...this.transform,
            rotate: this.rotation
        };
    }

    confirm(){
      // Upload the avatar
      const formData = new FormData();
      formData.append('file', this.croppedImageFile, this.connectedMembre.email + '.png'); 
      this.membreService.uploadAvatar(this.connectedMembre.id, formData).subscribe((membre)=> {
        //this.connectedMembre.avatarImageLink = membre.avatarImageLink;
        //this.connectedMembre.updatedDate = dayjs().startOf('day');
        //this.connectedMembre.creationDate = dayjs().startOf('day');
        //this.membreService.update(this.connectedMembre).subscribe((membre)=>{
        //console.log('L\'image de profil a été mise à jour');
          this.croppedImage =  membre.avatarImageLink;
          this.connectedMembre.avatarImageLink = membre.avatarImageLink;
          this.modal.dismiss();
        }) 
      //this.croppedImage = this.connectedMembre.avatarImageLink;
      //});
      //const imageCropped: string = this.croppedImage;
      //var debutImageValue = imageCropped.substring(0, imageCropped.indexOf(',') + 1);
      //debutImageValue = debutImageValue.substring(debutImageValue.indexOf(':')+1, debutImageValue.indexOf(';'))
      //const finImageCropped = imageCropped.substring(imageCropped.indexOf(',')+ 1);
      //this.connectedMembre.imageBlob = finImageCropped;
      //this.connectedMembre.imageBlobContentType=debutImageValue;

     
    }

 

}
