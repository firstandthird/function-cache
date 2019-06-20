workflow "build and test" {
  on = "push"
  resolves = [
    "test",
    "build",
    "lint",
  ]
}

action "build" {
  uses = "actions/npm@master"
  args = "install"
}

action "lint" {
  needs = [
    "build"
  ],
  uses = "actions/npm@master"
  args = "run lint"
}

action "test" {
  needs = [
    "build",
    "lint",
  ]
  uses = "actions/npm@master"
  args = "test"
}
