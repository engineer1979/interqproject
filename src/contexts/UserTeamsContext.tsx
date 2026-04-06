import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react'
import type { User, Team } from '@/types/userTeams'
import { mockUsers, mockTeams } from '@/data/userTeamsMock'
import { generateId } from '@/lib/utils'

interface UserTeamsState {
  users: User[]
  teams: Team[]
  isLoading: boolean
  error: string | null
}

type UserTeamsAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: Omit<User, 'id'> }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_TEAM'; payload: Omit<Team, 'id'> }
  | { type: 'UPDATE_TEAM'; payload: Team }
  | { type: 'DELETE_TEAM'; payload: string }
  | { type: 'ASSIGN_USER_TO_TEAM'; payload: { userId: string; teamId: string } }
  | { type: 'REMOVE_USER_FROM_TEAM'; payload: { userId: string; teamId: string } }

interface UserTeamsContextType {
  state: UserTeamsState
  dispatch: React.Dispatch<UserTeamsAction>
  addUser: (userData: Omit<User, 'id'>) => void
  updateUser: (user: User) => void
  deleteUser: (userId: string) => void
  addTeam: (teamData: Omit<Team, 'id'>) => void
  updateTeam: (team: Team) => void
  deleteTeam: (teamId: string) => void
  assignUserToTeam: (userId: string, teamId: string) => void
  removeUserFromTeam: (userId: string, teamId: string) => void
  getTeamMembers: (teamId: string) => User[]
  getUserTeams: (userId: string) => Team[]
}

const UserTeamsContext = createContext<UserTeamsContextType | undefined>(undefined)

const initialState: UserTeamsState = {
  users: [],
  teams: [],
  isLoading: false,
  error: null
}

function userTeamsReducer(state: UserTeamsState, action: UserTeamsAction): UserTeamsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_USERS':
      return { ...state, users: action.payload }
    case 'ADD_USER':
      return {
        ...state,
        users: [
          {
            id: generateId(),
            ...action.payload
          },
          ...state.users
        ]
      }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
      }
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      }
    case 'ADD_TEAM':
      return {
        ...state,
        teams: [
          {
            id: generateId(),
            ...action.payload
          },
          ...state.teams
        ]
      }
    case 'UPDATE_TEAM':
      return {
        ...state,
        teams: state.teams.map(team => team.id === action.payload.id ? action.payload : team)
      }
    case 'DELETE_TEAM':
      return {
        ...state,
        teams: state.teams.filter(team => team.id !== action.payload)
      }
    case 'ASSIGN_USER_TO_TEAM':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, teamIds: [...user.teamIds, action.payload.teamId] }
            : user
        )
      }
    case 'REMOVE_USER_FROM_TEAM':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.userId 
            ? { ...user, teamIds: user.teamIds.filter(id => id !== action.payload.teamId) }
            : user
        )
      }
    default:
      return state
  }
}

export function UserTeamsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userTeamsReducer, initialState)

  // Load mock data on mount
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    setTimeout(() => {
      dispatch({ type: 'SET_USERS', payload: mockUsers })
      dispatch({ type: 'SET_TEAMS', payload: mockTeams })
      dispatch({ type: 'SET_LOADING', payload: false })
    }, 500)
  }, [])

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    dispatch({ type: 'ADD_USER', payload: userData })
  }, [])

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }, [])

  const deleteUser = useCallback((userId: string) => {
    dispatch({ type: 'DELETE_USER', payload: userId })
  }, [])

  const addTeam = useCallback((teamData: Omit<Team, 'id'>) => {
    dispatch({ type: 'ADD_TEAM', payload: teamData })
  }, [])

  const updateTeam = useCallback((team: Team) => {
    dispatch({ type: 'UPDATE_TEAM', payload: team })
  }, [])

  const deleteTeam = useCallback((teamId: string) => {
    dispatch({ type: 'DELETE_TEAM', payload: teamId })
  }, [])

  const assignUserToTeam = useCallback((userId: string, teamId: string) => {
    dispatch({ type: 'ASSIGN_USER_TO_TEAM', payload: { userId, teamId } })
  }, [])

  const removeUserFromTeam = useCallback((userId: string, teamId: string) => {
    dispatch({ type: 'REMOVE_USER_FROM_TEAM', payload: { userId, teamId } })
  }, [])

  const getTeamMembers = useCallback((teamId: string) => {
    return state.users.filter(user => user.teamIds.includes(teamId))
  }, [state.users])

  const getUserTeams = useCallback((userId: string) => {
    return state.teams.filter(team => team.memberIds.includes(userId))
  }, [state.teams])

  const value = {
    state,
    dispatch,
    addUser,
    updateUser,
    deleteUser,
    addTeam,
    updateTeam,
    deleteTeam,
    assignUserToTeam,
    removeUserFromTeam,
    getTeamMembers,
    getUserTeams
  }

  return (
    <UserTeamsContext.Provider value={value}>
      {children}
    </UserTeamsContext.Provider>
  )
}

export function useUserTeams() {
  const context = useContext(UserTeamsContext)
  if (context === undefined) {
    throw new Error('useUserTeams must be used within a UserTeamsProvider')
  }
  return context
}

