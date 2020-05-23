import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Container } from 'semantic-ui-react'

class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = { editor: null };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }
  handleEditorChange = (content, editor) => {
    this.props.onEditorChange(content)
  }

  render() {
    // const height = (this.props.height != null)?this.props.height:"400"
    return (
      <Container>
        <Editor
          apiKey="81jvj4ftt29hdio9oky5wnvlxtugicmawfi048fvjjf2dlg8"
          init={{
            // selector: 'textarea',
            placeholder: 'write your comment',
            plugins: 'a11ychecker placeholder code advcode casechange formatpainter linkchecker autolink lists checklist media permanentpen powerpaste quickbars codesample table advtable tinycomments tinymcespellchecker autoresize',
            toolbar: 'a11ycheck emoticons quickimage addcomment showcomments casechange checklist  formatpainter pageembed permanentpen table',
            toolbar_mode: 'floating',
            // skin: 'oxide-dark',
            // content_css: 'dark',
            // plugins: 'quickbars emoticons quickbars quicklink blockquote codesample advcode',
            // toolbar:'emoticons codesample quickimage hr pagebreak ',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Ayush Bansal',
            autoresize_bottom_margin: 0,
            autoresize_overflow_padding: 0,
            // toolbar:false,
            menubar: false,
            // height: 400,
            // width: 400,
            // inline: true,
            quickbars_insert_toolbar: 'emoticons quickimage hr pagebreak codesample',
            quickbars_selection_toolbar: 'bold italic underline | formatselect | quicklink blockquote',
            contextmenu: 'undo redo ',
            powerpaste_word_import: 'clean',
            powerpaste_html_import: 'clean',
            content_css: '//www.tiny.cloud/css/codepen.min.css',
            statusbar: false,

          }}
          onEditorChange={this.handleEditorChange}
        />
      </Container>
    );
  }
}


export default EditorPage