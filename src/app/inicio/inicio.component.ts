import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { YoutubeService } from '../services/youtube.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  currentIndex = 0;
  constructor(
    private ytService: YoutubeService,
    private cd: ChangeDetectorRef
  ) {}

  imgActual = 'https://i.ytimg.com/vi/f64nXt1z4XU/hqdefault.jpg';
  ngOnInit(): void {
    this.ytService.InitPlayer();
    this.ytService.RegisterCallback((index) => {
      this.currentIndex = index;
      this.cd.detectChanges();
    });
  }

  ObtenerItemsPlaylist(listId: HTMLInputElement) {
    var link = listId.value;

    if (link == '') {
      alert('Ingresa el listId!');
      return;
    }

    this.ytService.FetchPlaylistItems(link);
  }

  GetCurrentSong(): any {
    return this.ytService.GetCurrentSong();
  }

  GetPlaylistItems(): any[] {
    return this.ytService.GetCurrentPlaylist();
  }

  GetPlayer() {
    return this.ytService.player;
  }

  CheckIfVideoPlaying() {
    return this.ytService.isVideoPlaying;
  }

  GetCurrentPosition(): number {
    return this.ytService.GetCurrentVideoPosition();
  }

  SkipNext() {
    this.ytService.playerSkipNext();
  }

  SkipPrev() {
    this.ytService.playerSkipPrev();
  }

  Play() {
    this.ytService.playerPause();
  }

  Pause() {
    this.ytService.playerPause();
  }

  VolDwn() {
    this.ytService.playerVolumeDown();
  }

  VolUp() {
    this.ytService.playerVolumeUp();
  }

  playSelectedItem(index: number) {
    this.ytService.PlaySongAtPosition(index);
  }
}
