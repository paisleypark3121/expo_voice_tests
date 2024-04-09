export const getRandomResponse = () => {
    const responses = [
        "Tommy lost the shopping list his mother had given him and just bought things he wanted to eat.",
        "I take off my slippers and put on my socks and shoes.",
        "Last weekend, she wanted to go to the wedding, but she wasn't sure it was safe.",
        "Chances are that you won’t do well if you don’t study.",
        "Nikita is a perfectly respectable businessman.",
        "He was in desperate need of a Christmas miracle.",
        "If you could live anywhere, where would you live and why?",
        "Create beautiful designs with a powerful tool.",
        "The rest of the party attendees had fallen silent.",
        "Deodorant helps to prevent embarrassing moments.",
        "On top of that, our power has been out since Sunday.",
        "Would you like to go out and get something to eat?"
    ];
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
};