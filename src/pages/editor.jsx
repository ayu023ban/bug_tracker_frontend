import React, { Component } from 'react'
// import { Editor, EditorState, RichUtils } from 'draft-js';
import { Editor } from '@tinymce/tinymce-react';
// class MyInput extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { value: '' };
//         this.onChange = evt => this.setState({ value: evt.target.value });
//     }
//     render() {
//         return <input value={this.state.value} onChange={this.onChange} />;
//     }
// }


class EditorPage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = { editorState: EditorState.createEmpty() };
    //     this.onChange = editorState => this.setState({ editorState });
    // }
    // handleKeyCommand = (command) => {
    //     const newState = RichUtils.handleKeyCommand(this.state.editorState, command)
    //     if (newState) {
    //         this.onChange(newState);
    //         return 'handled';
    //     } return 'not-handled';
    // }
    // onChange = (editorState) => {
    //     this.setState({
    //         editorState
    //     })
    // }
    // onUnderlineClick = () => {
    //     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
    // }

    // onBoldClick = () => {
    //     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
    // }

    // onItalicClick = () => {
    //     this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
    // }
    // handleEditorChange = (content, editor) => {
    //     console.log('Content was updated:', content);
    //   }

    render() {
        return (
            <Editor
            initialValue="<p>This is the initial content of the editor</p>"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
            }}
            onEditorChange={this.handleEditorChange}
          />
        );
    }

}
export default EditorPage