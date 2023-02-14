# Workflow 

### 1. Creating Your Branch
| Step | Command | Description |
| - | ------- | ----------- |
| 1 | `git branch [branch name]` | Create a new branch |
| 2 | `git checkout [branch name]` | Switch to the new branch |

### 2. Pushing a Change from Local Repository to Remote Repository

| Step | Command | Description |
| - | ------- | ----------- |
| 1 | `git pull` | Merge remote upstream changes into your local repository |
| 2 | `git add [file-name.txt]` | Add a file to the staging area |
| 3 | `git commit -m "[commit message]"` | Commit changes |
| 4 | `git push` | Push changes to remote repository of branch you are currently in |

### 3. Merging Your Changes Into Main Branch

| Step | Action | Description |
| - | ------- | ----------- |
| 1 | Make a pull request | This makes a request to merge your branch into the main branch |
| 2 | Select Someone to review your work | Optional |
| 3 | Label the type of pull request | Optional |
| 4 | Merge your changes into main | Press the "Merge pull request" button |


## Useful Git Commands

### Getting & Creating Projects

| Command | Description |
| ------- | ----------- |
| `git init` | Initialize a local Git repository |
| `git clone ssh://git@github.com/[username]/[repository-name].git` | Create a local copy of a remote repository |

### Basic Snapshotting

| Command | Description |
| ------- | ----------- |
| `git status` | Check status |
| `git add [file-name.txt]` | Add a file to the staging area |
| `git commit -m "[commit message]"` | Commit changes |

### Branching & Merging

| Command | Description |
| ------- | ----------- |
| `git branch` | List branches (the asterisk denotes the current branch) |
| `git branch -a` | List all branches (local and remote) |
| `git branch [branch name]` | Create a new branch |
| `git branch -d [branch name]` | Delete a branch |
| `git push origin --delete [branch name]` | Delete a remote branch |
| `git checkout -b [branch name]` | Create a new branch and switch to it |
| `git checkout -b [branch name] origin/[branch name]` | Clone a remote branch and switch to it |
| `git branch -m [old branch name] [new branch name]` | Rename a local branch |
| `git checkout [branch name]` | Switch to a branch |
| `git checkout -` | Switch to the branch last checked out |
| `git checkout -- [file-name.txt]` | Discard changes to a file |
| `git merge [branch name]` | Merge a branch into the active branch |
| `git merge [source branch] [target branch]` | Merge a branch into a target branch |
| `git stash` | Stash changes in a dirty working directory |
| `git stash clear` | Remove all stashed entries |

### Sharing & Updating Projects

| Command | Description |
| ------- | ----------- |
| `git push origin [branch name]` | Push a branch to your remote repository |
| `git push -u origin [branch name]` | Push changes to remote repository (and remember the branch) |
| `git push` | Push changes to remote repository (remembered branch) |
| `git push origin --delete [branch name]` | Delete a remote branch |
| `git pull` | Update local repository to the newest commit |
| `git pull origin [branch name]` | Pull changes from remote repository |



