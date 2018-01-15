import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { chatHighlights } from '../../../highlights-chat';


/**
 * Generated class for the HighlightsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-highlights',
  templateUrl: 'highlights.html',
})
export class HighlightsPage {
  public archive = 'chat';
  public chatData: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chatData = this.makeGrid(chatHighlights, 3);
    console.log(this.chatData);
  
  }

  makeGrid(data, columnAmount) {
    var grid = [];
    var col;
    var row = -1;

    for(var i = 0; i < data.length; i++) {
      col = i % columnAmount;

      if(col === 0) {
        grid[++row] = [];
      }
      
      grid[row][col] = data[i];
    }

    return grid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HighlightsPage');
  }

}
