import { Component, OnInit } from '@angular/core';
import { YoutubeService } from '../services/youtube.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public YT: any;
  public video: any;
  public player: any;
  public reframed: any;
  isVideoPlaying: boolean = false;
  isPlayerReady: boolean = false;
  playlistItems: any = [];
  playerVol: number = 50;
  currentVideo: number = 0;
  constructor(private ytService: YoutubeService) {}
  imgActual = 'https://i.ytimg.com/vi/f64nXt1z4XU/hqdefault.jpg';
  ngOnInit(): void {
    this.Init();
  }

  ObtenerItemsPlaylist(el: HTMLInputElement) {
    var link = el.value;

    if (link.includes('playlist')) {
      //https://youtube.com/playlist?list=PLGINh0aYNOJszP8zs7uaNTPgGhO2riFoS
      link = link.replace('https://youtube.com/playlist?list=', '');
      this.ytService.GetPlaylistItems(link).subscribe((data) => {
        if (data) {
          if (this.isPlayerReady) {
            this.playlistItems = data.items;
            var img = document.getElementById('imgActual') as HTMLImageElement;
            if (img != null) {
              img.src = this.playlistItems[0].snippet.thumbnails.high.url;
            }
            this.playerPlayVideo(this.player);
          }
        }
      });
    } else {
      alert('asegurate de incluir todo el link de la playlist');
    }
  }

  Init() {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var fsTag = document.getElementsByTagName('script')[0];
    fsTag.parentNode?.insertBefore(tag, fsTag);

    (window as { [key: string]: any })['onYouTubeIframeAPIReady'] = () =>
      this.StartVideo();
  }
  StartVideo() {
    this.reframed = false;
    this.player = new (window as { [key: string]: any })['YT'].Player(
      'player',
      {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 1,
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          PlayVideo: this.playerPlayVideo.bind(this),
        },
      }
    );
  }

  onPlayerReady(event: any) {
    this.isPlayerReady = true;
  }

  onPlayerStateChange(event: any) {
    switch (event.data) {
      case (window as { [key: string]: any })['YT'].PlayerState.PLAYING:
        break;
      case (window as { [key: string]: any })['YT'].PlayerState.PAUSED:
        break;
      case (window as { [key: string]: any })['YT'].PlayerState.ENDED:
        if (this.playlistItems.length >= this.currentVideo + 1) {
          this.currentVideo++;
          var img = document.getElementById('imgActual') as HTMLImageElement;
          if (img != null) {
            img.src =
              this.playlistItems[this.currentVideo].snippet.thumbnails.high.url;
          }
          this.player.loadVideoById(
            this.playlistItems[this.currentVideo].snippet.resourceId.videoId
          );
        }
        break;
    }
  }

  playerPlayVideo(event: any) {
    this.player.setVolume(this.playerVol);
    this.isVideoPlaying = true;
    this.currentVideo = 0;
    this.player.loadVideoById(this.playlistItems[0].snippet.resourceId.videoId);
  }

  playerVolumeUp(event: any) {
    this.playerVol += 10;
    if (this.playerVol >= 100) {
      this.playerVol = 100;
    }
    this.player.setVolume(this.playerVol);
  }

  playerVolumeDown(event: any) {
    this.playerVol -= 10;
    if (this.playerVol <= 0) {
      this.playerVol = 0;
    }
    this.player.setVolume(this.playerVol);
  }

  playerPause(event: any) {
    if (this.isVideoPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
    this.isVideoPlaying = !this.isVideoPlaying;
  }

  playerSkipNext(event: any) {
    if (this.playlistItems.length >= this.currentVideo + 1) {
      this.currentVideo++;
      var img = document.getElementById('imgActual') as HTMLImageElement;
      if (img != null) {
        img.src =
          this.playlistItems[this.currentVideo].snippet.thumbnails.high.url;
      }
      this.player.loadVideoById(
        this.playlistItems[this.currentVideo].snippet.resourceId.videoId
      );
    }
  }

  playerSkipPrev(event: any) {
    if (this.currentVideo > 0) {
      this.currentVideo--;
      var img = document.getElementById('imgActual') as HTMLImageElement;
      if (img != null) {
        img.src =
          this.playlistItems[this.currentVideo].snippet.thumbnails.high.url;
      }
      this.player.loadVideoById(
        this.playlistItems[this.currentVideo].snippet.resourceId.videoId
      );
    }
  }
}
