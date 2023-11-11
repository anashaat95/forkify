import PreviewView from './previewView';

class ResultsView extends PreviewView {
  _parentEl = document.querySelector('.results');
  _errMessage = 'No recipes found for your query. Please try again ;)';
}

export default new ResultsView();
