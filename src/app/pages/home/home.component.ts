import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaidDialog } from '../../shared/paid-dialog/paid-dialog';
import { ScenesGrid } from '../scenes/scenes-grid/scenes-grid';
import { ScenesCard } from '../scenes/scenes-card/scenes-card';
import { AvatarService } from '../../core/services/avatar.service';


@Component({
  selector: 'app-home',
  imports: [CommonModule, PaidDialog, ScenesGrid, ScenesCard],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{

  UUID: string = '23edfdb2-8ab1-4f09-9f3b-661e646e3965';
  isLoading: boolean = false;
  userAvatars: string[] = [];
  currentAvatar: string = "";

  constructor(
    private avatarService: AvatarService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadUserAvatars();
  }

  scenes = [
    {
      name: 'Домашний портрет',
      description: 'Мягкий свет, уют, естественность',
      image: 'assets/images/home-portrait.png'
    },
    {
      name: 'Студийный образ',
      description: 'Чистый фон, аккуратный свет',
      image: 'assets/images/studio-image.png'
    },
    {
      name: 'Городской вечер',
      description: 'Уличный свет, глубина, атмосфера',
      image: 'assets/images/city-evening.png'
    },
    {
      name: 'Зимний образ',
      description: 'Холодный свет, текстуры, объём',
      image: 'assets/images/winter-look.png'
    },
    {
      name: 'Профиль / Аватар',
      description: 'Идеально для соцсетей',
      image: 'assets/images/profile-avatar.png'
    },
    {
      name: 'Пара / Duo',
      description: 'Два человека в одном кадре',
      image: 'assets/images/pair-duo.png'
    },
  ];

  selectedScene: { name: string; description: string; image: string } | null = null;

  onSceneSelect(scene: { name: string; description: string; image: string }) {
    this.selectedScene = scene;
  }


  showPaidDialog = signal(true);

  closeDialog() {
    this.showPaidDialog.set(false);

    setTimeout(() => {
      this.showPaidDialog.set(true);
    }, 60_000);
  }

  loadUserAvatars() {
    const userId = this.UUID;
    this.isLoading = true;

    this.avatarService.findByUser(userId).subscribe({
      next: (avatar) => {
        if (avatar && avatar.imagesURL) {
          this.userAvatars = [...avatar.imagesURL];
          this.currentAvatar = this.userAvatars[0];
        } else {
          this.userAvatars = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
