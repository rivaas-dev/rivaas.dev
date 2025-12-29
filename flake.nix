{
  description = "Developer documentation for the Rivaas Go framework";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        # Development shell with Node.js and dependencies
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            gum
            nodejs_24
          ];

          shellHook = ''
            export NODE_PATH=$PWD/node_modules

            npm install
          '';
        };
      }
    );
}
