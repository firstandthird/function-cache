workflow "build and test" {
  on = "push"
  resolves = [
    "test",
    "build",
  ]
}

action "build" {
  uses = "actions/npm@master"
  args = "install"
}

action "test" {
  needs = "build"
  uses = "actions/npm@master"
  args = "test"
}
