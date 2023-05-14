import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  public YT: any;
  public video: any;
  public player: any = null;
  public reframed: any;
  isVideoPlaying: boolean = false;
  isPlayerReady: boolean = false;
  playlistItems: any = [];
  playerVol: number = 50;
  currentVideo: number = 0;
  urlBase: string = 'https://youtube.googleapis.com/youtube/v3/';
  APIKEY: string = 'AIzaSyCahpRLo0SMKUbnrzzgOjZjwdZXRy6wwso';
  currentPlaylist: [] = [];
  currentSong: any = {} as any;
  callbacks: ((index: number) => void)[] = [];

  constructor(private http: HttpClient) {}

  FetchPlaylistItems(listId: string) {
    this.GetPlaylistItems(listId).subscribe(
      (data) => {
        if (data) {
          if (this.isPlayerReady) {
            this.playlistItems = data.items;
            var img = document.getElementById('imgActual') as HTMLImageElement;
            if (img != null) {
              img.src = this.playlistItems[0].snippet.thumbnails.high.url;
            }
            this.SetCurrentSong(data.items[0]);
            this.SetCurrentPlaylist(data.items);
            this.playerPlayVideo(this.player);
          }
        }
      },
      (err) => {
        console.log(err);

        alert(err.error.error.message);
      }
    );
  }

  InitPlayer() {
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
        this.playerSkipNext();
        break;
    }
  }

  playerPlayVideo(event: any = null) {
    this.player.setVolume(this.playerVol);
    this.isVideoPlaying = true;
    this.currentVideo = 0;
    this.player.loadVideoById(
      this.playlistItems[0].snippet.resourceId.videoId,
      1
    );
  }

  playerVolumeUp(event: any = null) {
    this.playerVol += 10;
    if (this.playerVol >= 100) {
      this.playerVol = 100;
    }
    this.player.setVolume(this.playerVol);
  }

  playerVolumeDown(event: any = null) {
    this.playerVol -= 10;
    if (this.playerVol <= 0) {
      this.playerVol = 0;
    }
    this.player.setVolume(this.playerVol);
  }

  playerPause(event: any = null) {
    if (this.isVideoPlaying) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
    this.isVideoPlaying = !this.isVideoPlaying;
  }

  playerSkipNext(event: any = null) {
    if (this.playlistItems.length - 1 > this.currentVideo) {
      this.currentVideo++;
      var img = document.getElementById('imgActual') as HTMLImageElement;
      let lbl = document.getElementById('lblCurrent') as HTMLLabelElement;
      let next = this.playlistItems[this.currentVideo];
      if (img != null) {
        img.src = next.snippet.thumbnails.high.url;
      }
      lbl.innerText = next.snippet.title;
      this.player.loadVideoById(next.snippet.resourceId.videoId, 1);
      this.SetCurrentSong(next);
      this.callbacks.forEach((callback) => callback(this.currentVideo));
    }
  }

  playerSkipPrev(event: any = null) {
    if (this.currentVideo > 0) {
      this.currentVideo--;
      let img = document.getElementById('imgActual') as HTMLImageElement;
      let lbl = document.getElementById('lblCurrent') as HTMLLabelElement;
      let prev = this.playlistItems[this.currentVideo];
      if (img != null) {
        img.src = prev.snippet.thumbnails.high.url;
      }
      lbl.innerText = prev.snippet.title;
      this.player.loadVideoById(prev.snippet.resourceId.videoId, 1);

      this.SetCurrentSong(prev);
      this.callbacks.forEach((callback) => callback(this.currentVideo));
    }
  }

  GetPlaylistItems(idPlaylist: string) {
    return this.http.get<any>(
      `${this.urlBase}playlistItems?part=snippet&playlistId=${idPlaylist}&key=${this.APIKEY}&maxResults=50`
    );
  }

  PlaySongAtPosition(index: number) {
    this.currentVideo = index;
    let img = document.getElementById('imgActual') as HTMLImageElement;
    let lbl = document.getElementById('lblCurrent') as HTMLLabelElement;
    let prev = this.playlistItems[this.currentVideo];
    if (img != null) {
      img.src = prev.snippet.thumbnails.high.url;
    }
    lbl.innerText = prev.snippet.title;
    this.player.loadVideoById(prev.snippet.resourceId.videoId, 1);

    this.SetCurrentSong(prev);
    this.callbacks.forEach((callback) => callback(this.currentVideo));
  }

  SetCurrentPlaylist(playlist: []) {
    this.currentPlaylist = playlist;
  }

  GetCurrentPlaylist(): [] {
    return this.currentPlaylist;
  }

  GetSongAtPosition(position: number) {
    return this.currentPlaylist[position];
  }

  GetCurrentSong() {
    return this.currentSong;
  }

  SetCurrentSong(song: any) {
    this.currentSong = song;
  }

  GetPlayer() {
    return this.player;
  }

  GetCurrentVideoPosition(): number {
    return this.currentVideo;
  }

  RegisterCallback(callback: (index: number) => void) {
    this.callbacks.push(callback);
  }
}
