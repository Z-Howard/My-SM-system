import { defineStore } from "pinia"

import { generateDynamicRoutes, findRootPathRoute,mapTwoLevelRouter } from "@/utils/tools"
import router from "@/router"
import { post } from "@/api/http"
import { getMenuListByRoleId } from "@/api/url"
import { useUserStore } from "@/store/modules/user"

export const usePermissionStore = defineStore("permission", {
	state: () => ({
		permissionRoutes: [],
	}),
	getters: {
		getPermissionSideBar(state) {
			return state.permissionRoutes.filter(it => {
				return it.meta && !it.meta.hidden
			})
		},
		getPermissionRoutes(state) {
			return state.permissionRoutes
		},
	},
	actions: {
		async getRoutes(data: { userId: number; roleId: number }) {
			try {
				const res = await post({
					url: getMenuListByRoleId,
					data,
				})
				return res.data
			} catch (error) {}
		},
		async initPermissionRoutes() {
			const userStore = useUserStore()
			const tempAccess = await this.getRoutes({ userId: userStore.userId, roleId: userStore.roleId })
			const accessRoutes = generateDynamicRoutes(tempAccess)
			const mapRoutes = mapTwoLevelRouter(accessRoutes)
			mapRoutes.forEach(item => {
				router.addRoute(item)
			})
			console.log(mapRoutes)
			// 配置 `/` 路由的默认跳转地址
			router.addRoute({
				path: "/",
				redirect: findRootPathRoute(accessRoutes),
				meta: {
					hidden: true,
				},
			})
			// 这个路由一定要放在最后
			router.addRoute({
				path: "/:pathMatch(.*)*",
				redirect: "/404",
				meta: {
					hidden: true,
				},
			})
			console.log(router.getRoutes())
			this.permissionRoutes = [...accessRoutes]
		},
		isEmptyPermissionRoute() {
			return !this.permissionRoutes || this.permissionRoutes.length === 0
		},
	},
})
