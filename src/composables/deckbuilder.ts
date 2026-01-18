import shuffle from './shuffle';

function deckbuilder(cardArray: Array<any>) {
  
    let deckArray = [];

    for (let i = 0; i < cardArray.length; i++) {
        cardArray[i] = shuffle(cardArray[i]);
        deckArray.push(cardArray[i][0]);
    }

    deckArray = shuffle(deckArray);
    
    return deckArray;
}

export default deckbuilder;
