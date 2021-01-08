import json
from treeClasses import Node, Edge, Graph
import random
import pickle
import sys
import os

"""Usage: Type a word to get the best possible move.
-1 if the word is a word -> the computer challenges because they think it is a word
-2 if the word has no continuations -> the computer challenges by prompt
-3 if the computer has been challenged and there are no good continuations -> the computer forfeits the challenge
"""


def loadWords(filepath):
    """
    Imports all words from dictionary, returns words as a dict with values of 1.
    Current dictionary used: filtered version of ubuntu dictionary, with no words < 4 char long, proper nouns, or possessive words with apostrophes
    """
    with open(filepath, "r") as f:
        return json.load(f)


def isWord(word, wordlist):
    """
    Checks whether or not word is in wordlist.
    Returns TRUE/FALSE: whether or not the challenge was successful.
    Note: passing large lists between functions *should* be done by reference, so having wordlist as an input shouldnt be a problem.
    """
    # TODO: check if current word is in dictionary

    if len(word) >= 4:
        if word.lower() in wordlist:
            return True
        return False
    return False


def loadTree(filepath):
    """
    loads the already constructed tree from a .p file specified by filepath
    """
    return pickle.load(open(filepath, "rb"))


def zykaChoose(node, zturn):
    """
    Returns a string/word that Zyka chooses to play. Node is the node in the tree corresponding to the current letters in play.
    Decisions: if there are guaranteed wins, choose between one of those randomly
    If there are no guaranteed winning moves, choose between the top 5 children of the node with highest win probability.
    """

    def takeFirst(elem):
        """
        function to ensure sorting is only done by the first element of the tuple
        """
        return elem[0]

    # makes an array of tuples (win%, node) for possible moves
    moves = []
    # node is a guaranteed win
    if node.getWinner() == zturn:
        for child in tree.getChildren(node):
            if child.getWinner() == zturn:
                moves.append((1, child))
        # choose randomly between moves that win
        choice = random.choice(moves)

    # if the current word isnt winning, choose the child with most winning subchildren
    else:
        children = tree.getChildren(node)
        # iterates over all children nodes
        for child in children:
            subchildren = tree.getChildren(child)
            subLeng = len(subchildren)
            # check if any subchildren exist
            if subLeng != 0:
                subWinnerCount = 0
                # iterates over all subchildrent to find their winner values
                for subchild in subchildren:
                    if subchild.getWinner() == zturn:
                        subWinnerCount += 1
                moves.append((subWinnerCount / subLeng, child))
            # no subchildren - child.getName is a word
            else:
                moves.append((-1, child))
        # sorts the children and takes the ones with the highest probabilities
        moves.sort(key=takeFirst)
        try:
            choice = random.choice(moves[:5])
        except:
            choice = moves[0]
    # returns the chosen word
    return choice[1].getName()


def zykaTurn(curWord):
    """
    Returns Zyka's move if a letter is played, and -1 if Zyka challenges/round ends.
    """

    zturn = len(curWord) % 2 + 1
    # the letters in play form a valid word
    if isWord(curWord, words):
        return -1
    node = tree.getNode(curWord)

    # the letters in play are not a substring of any valid word
    if type(node) == int:
        return -2

    # zyka playing a letter
    return zykaChoose(node, zturn)


tree = loadTree("./game/tree/tree.p")
words = loadWords("./game/tree/u.txt")


def main():
    """
    main code
    """
    # Looping over each round
    curWord = sys.argv[1]
    if curWord[0] == "_":
        node = tree.getNode(curWord[1:])
        # Check if Zyka has a word in mind
        if type(node) == int or node.isWord():
            print("-3", end="")
        else:
            while tree.getChildren(node) != []:
                node = tree.getChildren(node)[0]
            print(node.getName(), end="")
    else:
        print(zykaTurn(curWord), end="")
    # print("hello world")


if __name__ == "__main__":
    main()
