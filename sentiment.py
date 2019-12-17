import nltk
import random
from nltk.corpus import PlaintextCorpusReader
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.tokenize import sent_tokenize
from nltk.stem import PorterStemmer
from os import listdir
from os.path import isfile, join

#nltk.download()

# tokenizing - word tokenizers .. sentence tokenizers -> seperate by
# lexicon and corporas
# corpora = body of text ie resumes 
# lexicon - dictionary => words and their meanings

#from nltk.tokenize import sent_tokenize, word_tokenize

#example_text = "Hello motherfucker Mr. Smith, how are you today? The weather sucks and so does python. "
#print(word_tokenize(example_text))

# stop words filtering -> basicly filtering out words that have no meaning

# RegEx or list of file names
# files = ".*\.txt" 
# corpus0 = PlaintextCorpusReader("./cvs/output", files) # this reads all the files with txt succesfully

files = [f for f in listdir("./cvs/output") if isfile(join("./cvs/output", f))]
contents = []
for file in files:
    contents.append(open('./cvs/output/' + file).read())

for content in contents:
    print(content.split('\n'))


# statements.findall(r"<.:> <\s+>")
# for s in statements:
#     print(s)

# corpus  = nltk.Text(corpus0.words())
# stop_words = set(stopwords.words("dutch"))

# # words = word_tokenize(, language='dutch', preserve_line=True)

# filtered_sentence = []

# #for w in words:
# #    if w not in stop_words:
# #        filtered_sentence.append(w)

# filtered_sentence = [w for w in corpus0.words() if not w in stop_words] #same as above
# # print(filtered_sentence)
# print(corpus0.sents())

#stemming -> normalization, take words; take the root stem (riding -> rid: stem for riding, ridden, etc ) 

# I was taking a ride in the car.
# I was riding in the car
# both mean the same but use different form of riding

# ps = PorterStemmer()
# example_words = ["python","pythoner","pythoning","pythoned","pythonly"]

# for w in example_words:
#     print(ps.stem(w))

#speech tagging

# import nltk
# from nltk.corpus import state_union
# from nltk.tokenize import PunktSentenceTokenizer

# train_text = state_union.raw("2006-GWBush.text")
# sample_text = state_union.raw("2006-GWBush.txt")

# custom_sent_tokenizer = PunktSentenceTokenizer(sample_text)

    
# chunking
# who/what etc is the sentence talking about; person place or thing

