import previewView from './previewView';
import View from './View';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!.';
  _generateMarkup() {
    return this._data.map(recipe => previewView.render(recipe, false)).join('');
  }
}
export default new ResultsView();
