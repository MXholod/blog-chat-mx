<template>
  <div class="editor-block">
    <div v-if="editor">
      <div class="editor-block__highlight">
        <button @click="editor.chain().focus().toggleBold().run()" class="button" :class="{ 'is-active': editor.isActive('bold') }">
          bold
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" class="button" :class="{ 'is-active': editor.isActive('italic') }">
          italic
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" class="button"  :class="{ 'is-active': editor.isActive('strike') }">
          strike
        </button>
        <button @click="editor.chain().focus().toggleCode().run()" class="button" :class="{ 'is-active': editor.isActive('code') }">
          code
        </button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()" class="button" :class="{ 'is-active': editor.isActive('codeBlock') }">
          code block
        </button>
      </div>
      <div class="editor-block__text">
        <button @click="editor.chain().focus().setParagraph().run()" class="button" :class="{ 'is-active': editor.isActive('paragraph') }">
          paragraph
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          h1
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          h4
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          h5
        </button>
        <button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" class="button" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          h6
        </button>
      </div>
      <div class="editor-block__list">
        <button @click="editor.chain().focus().toggleBulletList().run()" class="button" :class="{ 'is-active': editor.isActive('bulletList') }">
          bullet list
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()" class="button" :class="{ 'is-active': editor.isActive('orderedList') }">
          ordered list
        </button>
      </div>
      <div class="editor-block__line-break">
        <button @click="editor.chain().focus().setHorizontalRule().run()" class="button" >
          horizontal rule
        </button>
        <button @click="editor.chain().focus().setHardBreak().run()" class="button" >
          hard break
        </button>
      </div>
      <div class="editor-block__clear">
        <button @click="editor.chain().focus().unsetAllMarks().run()" class="button" >
          clear marks
        </button>
        <button @click="editor.chain().focus().clearNodes().run()" class="button" >
          clear nodes
        </button>
        <button @click="editor.chain().focus().undo().run()" class="button" >
          undo
        </button>
        <button @click="editor.chain().focus().redo().run()" class="button" >
          redo
        </button>
      </div>
    </div>
    <editor-content class="editable-zone" :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';

export default {
  components: {
    EditorContent,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    //Watch for prop 'value'
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;
      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)
      if (isSame) {
        return;
      }
      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      content: this.value,
      extensions: [
        StarterKit,
      ],
      onUpdate: () => {
        // HTML
        this.$emit('input', this.editor.getHTML());

        // JSON
        // this.$emit('input', this.editor.getJSON())
      },
    })
  },

  beforeDestroy() {
    this.editor.destroy();
  },
}
</script>

<style lang="scss">
.editor-block{
  width: 95%;
  padding: .5em;
  .editor-block__clear{
    border: 1px solid #f67373;
    padding: 2px 4px;
    display:inline-block;
    border-radius: 3px;
    background-color: #f67373;
    button{
      background-color: #ffdbdb;
    }
  }
  .editor-block__highlight{
    border: 1px solid #93e673;
    padding: 2px 4px;
    display:inline-block;
    border-radius: 3px;
    background-color: #93e673;
    button{
      background-color: #c4ebb4;
      &.is-active{
        background-color: lighten($color: #225AA4, $amount: 30%);
      }
    }
  }
  .editor-block__text{
    border: 1px solid #73cfe6;
    padding: 2px 4px;
    display:inline-block;
    border-radius: 3px;
    background-color: #73cfe6;
    button{
      background-color: #addfec;
      &.is-active{
        background-color: lighten($color: #225AA4, $amount: 30%);
      }
    }
  }
  .editor-block__list{
    border: 1px solid #af92f1;
    padding: 2px 4px;
    display:inline-block;
    border-radius: 3px;
    background-color: #af92f1;
    button{
      background-color: #cebcf8;
      &.is-active{
        background-color: lighten($color: #225AA4, $amount: 30%);
      }
    }
  }
  .editor-block__line-break{
    border: 1px solid #eff192;
    padding: 2px 4px;
    display:inline-block;
    border-radius: 3px;
    background-color: #eff192;
    button{
      background-color: #eff0c4;
      &.is-active{
        background-color: lighten($color: #225AA4, $amount: 30%);
      }
    }
  }
}
.button{
  border: 1px solid #000;
  padding: .1em .2em;
  border-radius: 3px;;
  &.is-active{
    background-color: lighten($color: #225AA4, $amount: 30%);
  }
}
/* Basic editor styles */
.editable-zone{
  margin: 1rem .5em .5em;
  .ProseMirror{
    border: 1px solid #616161;
    border-radius: 3px;
  }
}
.ProseMirror {
  background-color: #faf4f4;
  padding:10px 5px 10px 25px;
  > * + * {
    margin-top: 0.75em;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
}

.content {
  border: 1px solid #225AA4;
  padding: 1rem 0.5rem;

  h3 {
    margin: 1rem 0 0.5rem;
  }

  pre {
    border-radius: 5px;
    color: #333;
  }

  code {
    display: block;
    white-space: pre-wrap;
    font-size: 0.8rem;
    padding: 0.75rem 1rem;
    background-color:#e9ecef;
    color: #495057;
  }
}
</style>
