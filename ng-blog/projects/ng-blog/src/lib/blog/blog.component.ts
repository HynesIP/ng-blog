import { Component, Input, AfterViewChecked, AfterContentInit, OnInit } from '@angular/core';
import { IBlog } from './blog.interface';
import marked from 'marked';
import { FormControl } from '@angular/forms';
import { BlogService } from '../core/blog.service';

@Component({
  selector: 'ng-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit, AfterContentInit, AfterViewChecked {
  @Input()
  blog: IBlog;

  @Input()
  loading: boolean;

  // tslint:disable-next-line: variable-name
  private _errorMessage: string;
  public get errorMessage(): string {
    return this._errorMessage;
  }
  @Input()
  public set errorMessage(v: string) {
    this._errorMessage = marked(v ? v : '');
  }

  isEditing = false;
  editError: string = null;
  editor = new FormControl('');

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.editor.valueChanges.subscribe(() => {
      this.blog.content = this.editor.value.split(/\n/g);
    });
  }

  ngAfterContentInit(): void {
    if (this.blog.content) {
      const content = this.blog.content.join('\n');
      this.editor.setValue(content);
    }
  }

  ngAfterViewChecked(): void {
    if (this.blog.content) {
      this.updateBlogContent(this.blog.content);
    } else {
      document.getElementById('errors').innerHTML = this.errorMessage;
    }
  }

  updateBlogContent(lines: string[]) {
    const blogContent = document.getElementById(this.blog.postID);
    const content = this.blog.content.join('\n');
    this.editor.setValue(content);

    blogContent.innerHTML = marked(content);
  }

  async clickSaveChanges() {
    await this.load(() => {
      this.blog.content = this.editor.value.split(/\n/g);
      this.blog.postDate = new Date(Date.now());

      this.blogService
        .updateBlogAsync(this.blog.postID)
        .then(() => {
          this.isEditing = false;
          this.editError = null;
        })
        .catch(error => {
          this.editError = error.message;
        });
    });
  }

  clickEditBlog() {
    this.isEditing = true;
  }

  async clickDeleteBlog() {
    await this.load(() => {
      this.blogService.deleteBlogAsync(this.blog.postID).catch(error => {
        this.editError = error.message;
      });
    });
  }

  async load(callback) {
    this.loading = true;
    await callback();
    this.loading = false;
  }
}
