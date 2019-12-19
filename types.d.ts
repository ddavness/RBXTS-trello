/*
 *  Name: types.d.ts
 *  From @rbxts/trello
 *
 *  Description: Typings for @rbxts/trello NPM package.
 *
 *  Copyright (c) 2019 David Duque.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 */

/**
 *  Represents a Trello Account. Trello Entities are used to hold the API authentication string and to assign boards to.
 *  You can create and handle more than one TrelloClient at a given time, effectively controlling more than two accounts at the same time.
 */
interface Client {
    /** The authentication string that is appended at the end of the API URL's. DO NOT EXPOSE THIS STRING TO THE CLIENT! */
    readonly Auth: string;

    /** The username associated with the Trello account being managed by this TrelloClient. */
    readonly User: string | undefined;

    /**
     *  Creates a syntactically correct URL for use within the module. Authentication is automatically appended.
     *
     *  @param page The page that you wish to request to. Base URL is https://api.trello.com/1/ (page cannot be empty). Example: "/batch"
     *  @param queryParams A map containing any parameters you wish to pass. Example: {urls: ["/members", "/boards"]}
     *
     *  @returns A URL you can make requests to.
     */
    MakeURL(
        page: string,
        queryParams?: Map<string, string | boolean | number | Array<string> | Map<string, string | boolean | number>>,
    ): string;
}

interface TrelloClientConstructor {
    /**
     *  @constructor @yields Creates a new TrelloClient, that represents a Trello account.
     *
     *  @param key Your developer key. Cannot be empty or undefined.
     *  @param token Your developer token. Optional if you're only READING from a PUBLIC board.
     *  @param pedanticAssert Whether an error should be thrown (instead of a warning) if key validation fails.
     *
     *  @returns
     */
    new (key: string, token?: string | undefined, pedanticAssert?: boolean): Client | undefined;
}

interface Board {
    readonly RemoteId: string,
    Name: string,
    Description: string,
    Public: boolean,
    Closed: boolean,

    /**
     *  Pushes all metadata changes to Trello. (Doesn't apply to lists, cards, etc.)
     *
     *  @param force Whether to push all changes to the board even though nothing has been changed.
     */
    Commit(force?: boolean): void;

    /**
     *  Deletes this board from Trello. All garbage collection is up to the developer to perform.
     */
    Delete(): void;
}

interface TrelloBoardConstructor {
    /**
     *  @constructor @yields Creates a new Trello board, that is then also created on Trello.
     *
     *  @param entity The entity the board will be assigned to.
     *  @param name The Board's name. Must to be a non-empty string with a maximum of 16384 characters.
     *  @param public Whether the new board should be public or not. If this field is not provided, the board will be private.
     *
     *  @returns A new TrelloBoard that was freshly created.
     */
    new (entity: Client, name: string, public?: boolean): Board;

    /**
     *  @yields Fetches a TrelloBoard from Trello.
     *
     *  @param entity The entity the board will be assigned to.
     *  @param remoteId The board's ID.
     *
     *  @returns The Trello Board fetched. Undefined if the board doesn't exist.
     */
    fromRemote: (entity: Client, remoteId: string) => Board | undefined;

    /**
     *  @yields Fetches all the boards the provided entity has edit access to.
     *
     *  @param entity The entity where to fetch the boards from.
     *
     *  @returns An array containing zero or more trello boards.
     */
    fetchAllFrom: (entity: Client) => Array<Board>;
}

// Unimplemented interfaces
interface List {
    readonly RemoteId: string,
    Board: Board,
    Archived: boolean,
    Name: string
}

interface TrelloListConstructor {
    /**
     * @constructor @yields Creates a new Trello list and appends it to the given board.
     */
    new (board: Board, title: string): List;
}

interface Card {
    readonly RemoteId: string,
    List: List,
    Archived: boolean,
    Name: string,
    Description: string,
    Labels: Array<Label>

    Comment(comment: string): void;
    AssignLabels(label: Array<Label>): void;
    
}

interface TrelloCardConstructor {
    /**
     * @constructor @yields Creates a new Trello board and appends it to the bottom of the given list.
     */
    new (list: List, name: string, description: string): Card;

}

interface LabelColor {
    readonly None: string;
    readonly Black: string;
    readonly Red: string;
    readonly Orange: string;
    readonly Yellow: string;
    readonly LimeGreen: string;
    readonly Green: string;
    readonly SkyBlue: string;
    readonly Blue: string;
    readonly Purple: string;
    readonly Pink: string;
}

interface Label {
    readonly RemoteId: string;
    readonly Board: Board;
    name: string,
    color: LabelColor
}

interface TrelloLabelConstructor {
    new (board: Board, name: string, color: LabelColor): Label
}

declare const Client: TrelloClientConstructor;
declare const Board: TrelloBoardConstructor;

export { Client, Board };
