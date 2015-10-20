module.exports = (function (){
    var CollisionDetector = function(clients) {
        this.clients = clients;
        for(var i = 0; i < clients.length; i++) {
            if(i !== 0) clients[i].prev = clients[i - 1];
            if(i !== clients.length) clients[i].next = clients[i + 1];
        }
        this.front = null;
        if(clients.length !== 0) this.front = clients[0].player;
    };

    CollisionDetector.prototype.sort = function() {
        if(this.front === null) return;

        var node = this.front;
        node = node.next;
        this.front.next = null;

        while(node !== null) {
            var current = node;
            node = node.next;

            if(current.hitbox.x < this.front.hitbox.x) {
                current.next = this.front;
                this.front = current;
            } else {
                var search = this.front;
                while(search.next !== null && search.next.hitbox.x < current.hitbox.x) {
                    search = search.next;
                }
                current.next = search.next;
                search.next = current;
            }
        }
    };

    CollisionDetector.prototype.removeClient = function(client) {
        this.clients.splice(this.clients.indexOf(newClient), 1); //TODO defensive code
        if(client.player.prev !== null) {
            client.player.prev.next = client.player.next;
            client.player.prev = null;
        }
        if(client.player.next !== null) {
            client.player.next.prev = client.player.prev;
            client.player.next = null;
        }
    };

    CollisionDetector.prototype.addClient = function(client) {
        if(this.clients.length > 0) {
            this.clients[this.clients.length - 1].player.next = client.player;
            client.player.prev = this.clients[this.clients.length - 1].player;
        } else {
            this.front = client.player;
        }
        this.clients.push(client);
    };

    return CollisionDetector;
})();
