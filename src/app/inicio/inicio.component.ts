import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { YoutubeService } from '../services/youtube.service';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  currentIndex = 0;
  constructor(
    private ytService: YoutubeService,
    private cd: ChangeDetectorRef,
    private http: HttpClient
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

  alertUpdates() {
    this.GetLastestUpdates().subscribe(
      (data) => {
        let bdy = data.body.replace(/\r\n/g, '<br>');
        console.log(bdy);

        Swal.fire({
          title: data.name,
          html: `<div class="text-left">${bdy}</div>`,
          icon: 'info',
        });
      },
      (err) => {
        Swal.fire({ title: 'Error', text: 'Github API error', icon: 'error' });
      }
    );

    //
  }

  GetLastestUpdates() {
    return this.http.get<any>(
      'https://api.github.com/repos/WichoVS/YoutubePlaylistPlayer/releases/latest'
    );
  }
}
