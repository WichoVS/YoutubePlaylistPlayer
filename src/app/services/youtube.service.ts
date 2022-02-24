import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  urlBase: string = 'https://youtube.googleapis.com/youtube/v3/';
  APIKEY: string = 'AIzaSyCahpRLo0SMKUbnrzzgOjZjwdZXRy6wwso';
  constructor(private http: HttpClient) {}

  GetPlaylistItems(idPlaylist: string) {
    return this.http.get<any>(
      `${this.urlBase}playlistItems?part=snippet&playlistId=${idPlaylist}&key=${this.APIKEY}&maxResults=50`
    );
  }
}
