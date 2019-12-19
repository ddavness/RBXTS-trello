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
 *  You can create and handle more than one TrelloEntity at a given time, effectively controlling more than two accounts at the same time.
 */
interface Entity {
    /** The authentication string that is appended at the end of the API URL's. DO NOT EXPOSE THIS STRING TO THE CLIENT! */
    readonly Auth: string;

    /** The username associated with the Trello account being managed by this TrelloEntity. */
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

interface TrelloEntityConstructor {
    /**
     *  @constructor @yields Creates a new TrelloEntity, that represents a Trello account.
     *
     *  @param key Your developer key. Cannot be empty or undefined.
     *  @param token Your developer token. Optional if you're only READING from a PUBLIC board.
     *  @param pedanticAssert Whether an error should be thrown (instead of a warning) if key validation fails.
     *
     *  @returns
     */
    new (key: string, token?: string | undefined, pedanticAssert?: boolean): Entity | undefined;
}

interface Board {
    readonly RemoteId: string;
    Name: string;
    Description: string;
    Public: boolean;
    Closed: boolean;

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
     *  @constructor @yields Creates a new TrelloBoard, that represents a Trello board, that is then also created on Trello.
     *
     *  @param entity The entity the board will be assigned to.
     *  @param name The Board's name. Must to be a non-empty string with a maximum of 16384 characters.
     *  @param public Whether the new board should be public or not. If this field is not provided, the board will be private.
     *
     *  @returns A new TrelloBoard that was freshly created.
     */
    new (entity: Entity, name: string, public?: boolean): Board;

    /**
     *  @yields Fetches a TrelloBoard from Trello.
     *
     *  @param entity The entity the board will be assigned to.
     *  @param remoteId The board's ID.
     *
     *  @returns The Trello Board fetched. Undefined if the board doesn't exist.
     */
    fromRemote: (entity: Entity, remoteId: string) => Board | undefined;

    /**
     *  @yields Fetches all the boards the provided entity has edit access to.
     *
     *  @param entity The entity where to fetch the boards from.
     *
     *  @returns An array containing zero or more trello boards.
     */
    fetchAllFrom: (entity: Entity) => Array<Board>;
}

declare const Entity: TrelloEntityConstructor;
declare const Board: TrelloBoardConstructor;

export { Entity, Board };
